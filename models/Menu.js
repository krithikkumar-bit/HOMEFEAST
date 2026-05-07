const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  cook: { type: mongoose.Schema.Types.ObjectId, ref: 'Cook', required: true },
  name: { type: String, required: [true, 'Dish name required'], trim: true },
  type: { type: String, enum: ['Veg', 'Non-Veg'], required: true },
  price: { type: Number, required: [true, 'Price required'], min: 0 },
  available: { type: Boolean, default: true },
  popular: { type: Boolean, default: false },
  description: { type: String, trim: true }
}, { timestamps: true });

menuSchema.index({ cook: 1, available: 1 });

module.exports = mongoose.model('Menu', menuSchema);