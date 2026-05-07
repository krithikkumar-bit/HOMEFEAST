const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Review = require('../models/Review');
const Cook = require('../models/Cook');

router.use(protect);

router.post('/', async (req, res, next) => {
  try {
    const { cookId, rating, text } = req.body;
    const existing = await Review.findOne({ user: req.user.id, cook: cookId });
    if (existing) return res.status(400).json({ success: false, message: 'Already reviewed this cook' });
    const review = await Review.create({ user: req.user.id, cook: cookId, rating, text });
    const stats = await Review.aggregate([{ $match: { cook: review.cook } }, { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }]);
    if (stats.length) await Cook.findByIdAndUpdate(cookId, { rating: Math.round(stats[0].avgRating * 10) / 10, reviewCount: stats[0].count });
    await review.populate('user', 'firstName lastName');
    res.status(201).json({ success: true, message: 'Review submitted', data: review });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    const stats = await Review.aggregate([{ $match: { cook: review.cook } }, { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }]);
    await Cook.findByIdAndUpdate(review.cook, { rating: stats.length ? Math.round(stats[0].avgRating * 10) / 10 : 0, reviewCount: stats.length ? stats[0].count : 0 });
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) { next(err); }
});

module.exports = router;