const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');
const Cook = require('../models/Cook');
const Subscription = require('../models/Subscription');
const { generateOrderId, getSubscriptionEndDate } = require('../utils/helpers');

router.use(protect);

// POST /api/orders
router.post('/', async (req, res, next) => {
  try {
    const { cookId, plan, meal, mealPreference, deliveryAddress } = req.body;
    const cook = await Cook.findById(cookId);
    if (!cook) return res.status(404).json({ success: false, message: 'Cook not found' });
    if (cook.status !== 'approved') return res.status(400).json({ success: false, message: 'Cook not yet approved' });

    const amount = cook.plans[plan.toLowerCase()];
    if (!amount) return res.status(400).json({ success: false, message: 'Invalid plan' });

    const orderId = await generateOrderId(Order);
    const startDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const endDate = plan !== 'Daily' ? getSubscriptionEndDate(plan) : undefined;

    const order = await Order.create({ orderId, user: req.user.id, cook: cookId, meal, plan, amount, status: 'Pending', deliveryAddress: deliveryAddress || req.user.address, mealPreference: mealPreference || ['lunch'], startDate, endDate });

    if (plan === 'Daily') {
      order.status = 'Active';
      await order.save();
      cook.totalEarnings += amount;
      await cook.save();
    }
    res.status(201).json({ success: true, message: plan === 'Daily' ? 'Daily meal ordered!' : 'Subscription request sent to cook.', data: order });
  } catch (err) { next(err); }
});

// GET /api/orders/:id
router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('cook', 'name cuisine avatar area').populate('user', 'firstName lastName area');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
});

// PUT /api/orders/:id/cancel
router.put('/:id/cancel', async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (!['Pending', 'Active'].includes(order.status)) return res.status(400).json({ success: false, message: 'Cannot cancel this order' });
    order.status = 'Cancelled';
    await order.save();
    await Subscription.updateMany({ user: order.user, cook: order.cook, status: 'Active' }, { status: 'Cancelled' });
    res.json({ success: true, message: 'Order cancelled', data: order });
  } catch (err) { next(err); }
});

module.exports = router;