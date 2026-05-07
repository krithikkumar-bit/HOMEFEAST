const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cook: { type: mongoose.Schema.Types.ObjectId, ref: 'Cook', required: true },
  rating: { type: Number, required: [true, 'Rating required'], min: 1, max: 5 },
  text: { type: String, required: [true, 'Review text required'], trim: true, maxlength: 500 }
}, { timestamps: true });

reviewSchema.index({ user: 1, cook: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);