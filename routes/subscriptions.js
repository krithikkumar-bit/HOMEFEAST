const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Subscription = require('../models/Subscription');

router.get('/stats', protect, authorize('admin'), async (req, res, next) => {
  try {
    const active = await Subscription.countDocuments({ status: 'Active' });
    const total = await Subscription.countDocuments();
    const planBreakdown = await Subscription.aggregate([{ $match: { status: 'Active' } }, { $group: { _id: '$plan', count: { $sum: 1 } } }]);
    res.json({ success: true, data: { active, total, planBreakdown } });
  } catch (err) { next(err); }
});

router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const subs = await Subscription.find().populate('user', 'firstName lastName email area').populate('cook', 'name cuisine area').sort({ createdAt: -1 });
    res.json({ success: true, data: subs });
  } catch (err) { next(err); }
});

module.exports = router;