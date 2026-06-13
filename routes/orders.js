const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');
const Cook = require('../models/Cook');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Menu = require('../models/Menu');
const { generateOrderId, getSubscriptionEndDate } = require('../utils/helpers');


/* =========================
   GET ALL ORDERS (admin use)
========================= */
router.get('/', protect, async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('cook', 'name cuisine area avatar')
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) { next(err); }
});


/* =========================
   USER ORDER HISTORY
   GET /api/orders/my
========================= */
router.get('/my', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('cook', 'name cuisine area avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) { next(err); }
});


/* =========================
   CREATE ORDER (Cart-based)
   POST /api/orders
========================= */
router.post('/', protect, async (req, res, next) => {
  try {
    const {
      items,
      address,
      paymentMethod,
      cookId,
      plan,
      meal,
      mealPreference,
      deliveryAddress,
      useWallet,
      customizationNotes
    } = req.body;

    const isCartOrder = Array.isArray(items) && items.length > 0;
    const isSubOrder = cookId && plan && meal;

    if (!isCartOrder && !isSubOrder) {
      return res.status(400).json({
        success: false,
        message: 'Order must have items (cart) or cookId+plan+meal (subscription)'
      });
    }

    const orderId = await generateOrderId(Order);

    let orderData = {
      orderId,
      user: req.user.id,
      status: 'placed',
      paymentMethod: paymentMethod || 'cod',
      customizationNotes
    };

    // Track subscription amount for creating Subscription doc later
    let subAmount = 0;
    let subStartDate = null;
    let subEndDate = null;

    if (isCartOrder) {
      // --- CART-BASED ORDER ---
      const subtotal = items.reduce((sum, i) => sum + (i.price * (i.qty || 1)), 0);
      const delivery = subtotal >= 500 ? 0 : 29;
      const gst = Math.round(subtotal * 0.05);
      const total = subtotal + delivery + gst;

      let orderCookId = cookId;

      let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
      for (const item of items) {
        if (item.mealId) {
          try {
            const menuItem = await Menu.findById(item.mealId);
            if (menuItem) {
              if (!orderCookId) orderCookId = menuItem.cook;
              const qty = item.qty || 1;
              totalCalories += (menuItem.calories || 0) * qty;
              totalProtein += (menuItem.protein || 0) * qty;
              totalCarbs += (menuItem.carbs || 0) * qty;
              totalFat += (menuItem.fat || 0) * qty;
            }
          } catch (e) { /* ignore individual menu lookup errors */ }
        }
      }

      // Handle wallet payment
      let walletAmountUsed = 0;
      if (useWallet || paymentMethod === 'wallet') {
        const user = await User.findById(req.user.id);
        const walletAvail = user.walletBalance || 0;
        walletAmountUsed = Math.min(walletAvail, total);
        const remaining = total - walletAmountUsed;

        if (walletAmountUsed > 0) {
          user.walletBalance -= walletAmountUsed;
          user.walletTransactions.push({
            type: 'debit',
            amount: walletAmountUsed,
            description: `Payment for order ${orderId}`
          });
          await user.save();
        }

        if (remaining <= 0) {
          orderData.paymentStatus = 'paid';
          orderData.paymentMethod = 'wallet';
        } else {
          orderData.paymentMethod = 'cod';
        }
      }

      orderData = {
        ...orderData,
        items,
        cook: orderCookId || undefined,
        address: address || {},
        deliveryAddress: address ? `${address.line1}, ${address.city}` : (deliveryAddress || ''),
        subtotal,
        delivery,
        gst,
        total,
        amount: total,
        walletAmountUsed,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat
      };

    } else {
      // --- SUBSCRIPTION ORDER ---
      const cook = await Cook.findById(cookId);
      if (!cook) return res.status(404).json({ success: false, message: 'Cook not found' });
      if (cook.status !== 'approved') return res.status(400).json({ success: false, message: 'Cook not approved' });

      const amount = cook.plans?.[plan?.toLowerCase()] || 0;
      const startDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const endDate = plan !== 'Daily' ? getSubscriptionEndDate(plan) : undefined;

      // FIX: Store subscription details for creating Subscription document
      subAmount = amount;
      subStartDate = startDate;
      subEndDate = endDate;

      orderData = {
        ...orderData,
        cook: cookId,
        meal,
        plan,
        amount,
        total: amount,
        subtotal: amount,
        delivery: 0,
        gst: 0,
        status: 'placed',
        deliveryAddress: deliveryAddress || req.user.address,
        mealPreference: mealPreference || ['lunch'],
        startDate,
        endDate
      };

      if (plan === 'Daily') {
        orderData.status = 'confirmed';
        cook.totalEarnings += amount;
        await cook.save();
      }
    }

    const order = await Order.create(orderData);

    // ============================================================
    // FIX: Create a Subscription document for Weekly/Monthly orders
    // This ensures the dashboard subscription count works correctly
    // ============================================================
    if (isSubOrder && plan !== 'Daily') {
      try {
        await Subscription.create({
          user: req.user.id,
          cook: cookId,
          plan: plan,
          amount: subAmount,
          status: 'Active',
          startDate: subStartDate,
          endDate: subEndDate,
          mealPreference: mealPreference || ['lunch'],
          deliveryAddress: deliveryAddress || req.user.address || ''
        });
      } catch (subErr) {
        console.error('Failed to create subscription document:', subErr.message);
        // Don't fail the order if subscription creation fails
      }
    }

    res.status(201).json({
      success: true,
      message: isCartOrder ? 'Order placed successfully!' : (plan === 'Daily' ? 'Daily meal ordered!' : 'Subscription request sent.'),
      data: order
    });

  } catch (err) { next(err); }
});


/* =========================
   GET SINGLE ORDER
========================= */
router.get('/:id', protect, async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { $or: [{ _id: id }, { orderId: id }] }
      : { orderId: id };

    const order = await Order.findOne(query)
      .populate('cook', 'name cuisine area avatar')
      .populate('user', 'firstName lastName email phone');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const orderUserId = order.user ? order.user._id.toString() : null;
    if (orderUserId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.json({ success: true, data: order });
  } catch (err) { next(err); }
});


/* =========================
   UPDATE ORDER STATUS (cook/admin)
========================= */
router.put('/:id/status', protect, async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['placed', 'confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;

    // Credit wallet on delivery (for demo: 2% cashback)
    if (status === 'delivered') {
      const cashback = Math.round((order.total || 0) * 0.02);
      if (cashback > 0) {
        await User.findByIdAndUpdate(order.user, {
          $inc: { walletBalance: cashback },
          $push: {
            walletTransactions: {
              type: 'credit',
              amount: cashback,
              description: `2% cashback on order ${order.orderId}`
            }
          }
        });
      }
    }

    // FIX: Also update the corresponding Subscription status when order is cancelled
    if (status === 'cancelled' && order.cook) {
      try {
        await Subscription.updateMany(
          { user: order.user, cook: order.cook, status: 'Active' },
          { status: 'Cancelled' }
        );
      } catch (subErr) {
        console.error('Failed to update subscription on cancel:', subErr.message);
      }
    }

    await order.save();
    res.json({ success: true, message: 'Order status updated', data: order });
  } catch (err) { next(err); }
});


/* =========================
   CANCEL ORDER
========================= */
router.put('/:id/cancel', protect, async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (['delivered', 'on_the_way'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel order at this stage' });
    }

    order.status = 'cancelled';

    // Refund wallet if wallet was used
    if (order.walletAmountUsed > 0) {
      await User.findByIdAndUpdate(order.user, {
        $inc: { walletBalance: order.walletAmountUsed },
        $push: {
          walletTransactions: {
            type: 'credit',
            amount: order.walletAmountUsed,
            description: `Refund for cancelled order ${order.orderId}`
          }
        }
      });
    }

    await order.save();

    // FIX: Also cancel the corresponding Subscription
    if (order.cook) {
      try {
        await Subscription.updateMany(
          { user: order.user, cook: order.cook, status: 'Active' },
          { status: 'Cancelled' }
        );
      } catch (subErr) {
        console.error('Failed to cancel subscription:', subErr.message);
      }
    }

    res.json({ success: true, message: 'Order cancelled', data: order });
  } catch (err) { next(err); }
});

module.exports = router;
