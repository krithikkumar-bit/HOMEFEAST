const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cook: { type: mongoose.Schema.Types.ObjectId, ref: 'Cook', required: true },
  meal: { type: String, required: true, trim: true },
  plan: { type: String, enum: ['Daily', 'Weekly', 'Monthly'], required: true },
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['Pending', 'Active', 'Completed', 'Cancelled'], default: 'Pending' },
  deliveryAddress: { type: String, trim: true },
  mealPreference: { type: [String], enum: ['lunch', 'dinner'], default: ['lunch'] },
  startDate: { type: Date },
  endDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);