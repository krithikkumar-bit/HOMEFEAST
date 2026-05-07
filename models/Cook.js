const mongoose = require('mongoose');

const cookSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true, trim: true },
  tagline: { type: String, trim: true },
  cuisine: { type: String, required: true, trim: true },
  area: { type: String, required: true, trim: true },
  image: { type: String, default: '' },
  avatar: { type: String, default: '' },
  types: { type: [String], enum: ['Veg', 'Non-Veg'], required: true },
  experience: { type: String, default: '1 year' },
  deliveryTime: { type: String, trim: true },
  plans: {
    daily: { type: Number, required: true, min: 0 },
    weekly: { type: Number, required: true, min: 0 },
    monthly: { type: Number, required: true, min: 0 }
  },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  status: { type: String, enum: ['approved', 'pending', 'suspended'], default: 'pending' },
  totalEarnings: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Cook', cookSchema);