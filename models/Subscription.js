const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cook: { type: mongoose.Schema.Types.ObjectId, ref: 'Cook', required: true },
  plan: { type: String, enum: ['Daily', 'Weekly', 'Monthly'], required: true },
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['Active', 'Paused', 'Cancelled', 'Expired'], default: 'Active' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  // FIX: Added pausedAt field — was being set in routes/users.js but missing from schema
  pausedAt: { type: Date },
  mealPreference: { type: [String], enum: ['lunch', 'dinner'], default: ['lunch', 'dinner'] },
  deliveryAddress: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
