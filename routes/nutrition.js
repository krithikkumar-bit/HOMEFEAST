const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');

/* GET /api/nutrition/summary — calorie & macro summary for last 7 days */
router.get('/summary', protect, async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const orders = await Order.find({
      user: req.user.id,
      status: { $in: ['delivered'] },
      createdAt: { $gte: since }
    });

    const totals = orders.reduce((acc, o) => ({
      calories: acc.calories + (o.totalCalories || 0),
      protein: acc.protein + (o.totalProtein || 0),
      carbs: acc.carbs + (o.totalCarbs || 0),
      fat: acc.fat + (o.totalFat || 0),
      orders: acc.orders + 1,
      spent: acc.spent + (o.total || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, orders: 0, spent: 0 });

    const user = await User.findById(req.user.id).select('dailyCalorieTarget dietaryGoal');
    const dailyTarget = user.dailyCalorieTarget || 2000;
    const avgDaily = totals.orders > 0 ? Math.round(totals.calories / days) : 0;

    res.json({
      success: true,
      data: {
        period: `Last ${days} days`,
        totals,
        averagePerDay: {
          calories: avgDaily,
          protein: Math.round(totals.protein / days),
          carbs: Math.round(totals.carbs / days),
          fat: Math.round(totals.fat / days)
        },
        dailyCalorieTarget: dailyTarget,
        targetProgress: dailyTarget > 0 ? Math.round((avgDaily / dailyTarget) * 100) : 0,
        dietaryGoal: user.dietaryGoal
      }
    });
  } catch (err) { next(err); }
});

/* PUT /api/nutrition/preferences — update dietary preferences */
router.put('/preferences', protect, async (req, res, next) => {
  try {
    const { dietaryGoal, dailyCalorieTarget, allergies } = req.body;
    const update = {};
    if (dietaryGoal) update.dietaryGoal = dietaryGoal;
    if (dailyCalorieTarget) update.dailyCalorieTarget = dailyCalorieTarget;
    if (allergies) update.allergies = allergies;

    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true })
      .select('dietaryGoal dailyCalorieTarget allergies');

    res.json({ success: true, message: 'Preferences updated', data: user });
  } catch (err) { next(err); }
});

module.exports = router;
