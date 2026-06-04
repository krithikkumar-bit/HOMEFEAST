const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Cook = require('../models/Cook');
const Order = require('../models/Order');
const User = require('../models/User');
const Menu = require('../models/Menu');

/* GET /api/recommendations — AI-based meal recommendations */
router.get('/', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('dietaryGoal dailyCalorieTarget allergies area');

    // Get user's order history
    const pastOrders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 }).limit(20)
      .populate('cook', 'name cuisine area types');

    // Build preference profile
    const cuisineFreq = {};
    const cookFreq = {};
    pastOrders.forEach(o => {
      if (o.cook) {
        const cuisine = o.cook.cuisine;
        const cookId = o.cook._id.toString();
        cuisineFreq[cuisine] = (cuisineFreq[cuisine] || 0) + 1;
        cookFreq[cookId] = (cookFreq[cookId] || 0) + 1;
      }
      if (o.items) {
        o.items.forEach(item => {
          // track item names for preference matching
        });
      }
    });

    const topCuisine = Object.entries(cuisineFreq).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topCookId = Object.entries(cookFreq).sort((a, b) => b[1] - a[1])[0]?.[0];

    // Get approved cooks
    const allCooks = await Cook.find({ status: 'approved' }).sort({ rating: -1 });

    // Scoring algorithm
    const scored = await Promise.all(allCooks.map(async cook => {
      let score = 0;
      const reasons = [];

      // Base: rating
      score += (cook.rating || 0) * 10;

      // Preferred cuisine match
      if (topCuisine && cook.cuisine === topCuisine) {
        score += 30;
        reasons.push(`Matches your favourite ${topCuisine} cuisine`);
      }

      // Previously ordered from this cook
      if (cookFreq[cook._id.toString()]) {
        score += 20;
        reasons.push('You\'ve ordered from this cook before');
      }

      // Dietary goal adjustments
      if (user.dietaryGoal === 'weight_loss' && cook.types?.includes('Veg')) {
        score += 15;
        reasons.push('Veg options support your weight loss goal');
      }
      if (user.dietaryGoal === 'muscle_gain') {
        const menu = await Menu.findOne({ cook: cook._id, protein: { $gt: 15 } });
        if (menu) { score += 20; reasons.push('High-protein meals available'); }
      }

      // Area proximity
      if (user.area && cook.area?.toLowerCase().includes(user.area.toLowerCase())) {
        score += 25;
        reasons.push('Delivers to your area');
      }

      // Budget-friendly
      if (cook.plans?.daily <= 150) {
        score += 10;
        reasons.push('Budget-friendly');
      }

      // Get a sample menu item
      const sampleItem = await Menu.findOne({ cook: cook._id, available: true })
        .select('name price calories type');

      return {
        cook: {
          _id: cook._id,
          name: cook.name,
          cuisine: cook.cuisine,
          area: cook.area,
          rating: cook.rating,
          types: cook.types,
          plans: cook.plans,
          avatar: cook.avatar,
          image: cook.image
        },
        score,
        reasons: reasons.length > 0 ? reasons : ['Highly rated in your area'],
        sampleItem
      };
    }));

    // Sort by score, return top 6
    const recommendations = scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    // Update last recommendations timestamp
    await User.findByIdAndUpdate(req.user.id, { lastRecommendations: new Date() });

    res.json({
      success: true,
      data: {
        recommendations,
        basedOn: {
          orderHistory: pastOrders.length,
          preferredCuisine: topCuisine || 'Not enough data yet',
          dietaryGoal: user.dietaryGoal
        }
      }
    });
  } catch (err) { next(err); }
});

/* GET /api/recommendations/menu/:cookId — recommended menu items for a specific cook */
router.get('/menu/:cookId', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('dietaryGoal dailyCalorieTarget allergies');
    const menuItems = await Menu.find({ cook: req.params.cookId, available: true });

    if (!menuItems.length) {
      return res.json({ success: true, data: [] });
    }

    const scored = menuItems.map(item => {
      let score = item.popular ? 20 : 0;
      const reasons = [];

      if (user.dietaryGoal === 'weight_loss' && item.calories > 0 && item.calories < 400) {
        score += 30;
        reasons.push('Low calorie');
      }
      if (user.dietaryGoal === 'muscle_gain' && (item.protein || 0) > 20) {
        score += 30;
        reasons.push('High protein');
      }
      if (item.type === 'Veg') {
        score += 5;
        reasons.push('Vegetarian');
      }
      if (item.popular) reasons.push('Popular dish');

      // Filter out allergies
      const allergyMatch = (user.allergies || []).some(a =>
        item.name?.toLowerCase().includes(a.toLowerCase()) ||
        item.description?.toLowerCase().includes(a.toLowerCase())
      );
      if (allergyMatch) score = -999;

      return { item, score, reasons };
    });

    const recommended = scored
      .filter(s => s.score > -999)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(s => ({ ...s.item.toObject(), recommendationReasons: s.reasons }));

    res.json({ success: true, data: recommended });
  } catch (err) { next(err); }
});

module.exports = router;
