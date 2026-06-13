const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  mealId: { type: String },
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  qty: { type: Number, required: true, min: 1, default: 1 },
  customizations: { type: String, trim: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cook: { type: mongoose.Schema.Types.ObjectId, ref: 'Cook' },
  // NEW: support cart-based orders with multiple items
  items: [orderItemSchema],
  // Legacy single-meal fields kept for subscription orders
  meal: { type: String, trim: true },
  plan: { type: String, enum: ['Daily', 'Weekly', 'Monthly', 'OneTime'], default: 'OneTime' },
  amount: { type: Number, min: 0 },
  subtotal: { type: Number, min: 0, default: 0 },
  delivery: { type: Number, min: 0, default: 0 },
  gst: { type: Number, min: 0, default: 0 },
  total: { type: Number, min: 0, default: 0 },
  status: {
    type: String,
    // FIX: Standardized all status values to lowercase for consistency.
    // Removed capitalized variants ('Pending', 'Active', 'Completed', 'Cancelled')
    // that were causing queries to miss data. All new orders use lowercase.
    // If you have existing data with capitalized values, run a migration.
    enum: ['placed', 'confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled'],
    default: 'placed'
  },
  address: {
    name: { type: String },
    phone: { type: String },
    line1: { type: String },
    line2: { type: String },
    city: { type: String },
    pin: { type: String },
    notes: { type: String }
  },
  deliveryAddress: { type: String, trim: true },
  paymentMethod: { type: String, enum: ['cod', 'online', 'wallet'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  // Wallet
  walletAmountUsed: { type: Number, default: 0 },
  // Meal customization
  mealPreference: { type: [String], enum: ['lunch', 'dinner'], default: ['lunch'] },
  customizationNotes: { type: String, trim: true },
  // Nutrition (populated from menu items)
  totalCalories: { type: Number, default: 0 },
  totalProtein: { type: Number, default: 0 },
  totalCarbs: { type: Number, default: 0 },
  totalFat: { type: Number, default: 0 },
  startDate: { type: Date },
  endDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
