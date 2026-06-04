const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');
const Cook = require('../models/Cook');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
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
      items,          // array: [{mealId, name, price, qty, customizations}]
      address,        // {name, phone, line1, line2, city, pin, notes}
      paymentMethod,  // 'cod' | 'online' | 'wallet'
      cookId,         // optional: for subscription orders
      plan,           // optional: 'Daily'|'Weekly'|'Monthly' for subscription
      meal,           // optional: for subscription
      mealPreference, // optional
      deliveryAddress,// optional legacy
      useWallet,      // boolean: use wallet balance
      customizationNotes
    } = req.body;

    // Validate: must have either items (cart order) or cookId+plan+meal (subscription)
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

    if (isCartOrder) {
      // --- CART-BASED ORDER ---
      const subtotal = items.reduce((sum, i) => sum + (i.price * (i.qty || 1)), 0);
      const delivery = subtotal >= 500 ? 0 : 29;
      const gst = Math.round(subtotal * 0.05);
      const total = subtotal + delivery + gst;

      // Detect cook from first item if possible
      let orderCookId = cookId;

      // Calculate nutrition totals if available from menu
      const Menu = require('../models/Menu');
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

        // If wallet fully covers the order, mark as paid
        if (remaining <= 0) {
          orderData.paymentStatus = 'paid';
          orderData.paymentMethod = 'wallet';
        } else {
          orderData.paymentMethod = 'cod'; // rest via COD
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
        status: plan === 'Daily' ? 'placed' : 'placed',
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
    const order = await Order.findById(req.params.id)
      .populate('cook', 'name cuisine area avatar')
      .populate('user', 'firstName lastName email phone');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
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

    if (order.cook) {
      await Subscription.updateMany(
        { user: order.user, cook: order.cook },
        { status: 'Cancelled' }
      );
    }

    res.json({ success: true, message: 'Order cancelled', data: order });
  } catch (err) { next(err); }
});

module.exports = router;
