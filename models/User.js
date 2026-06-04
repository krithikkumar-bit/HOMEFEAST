const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, 'First name required'], trim: true, maxlength: 50 },
  lastName: { type: String, required: [true, 'Last name required'], trim: true, maxlength: 50 },
  email: { type: String, required: [true, 'Email required'], unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  password: { type: String, required: [true, 'Password required'], minlength: 8, select: false },
  role: { type: String, enum: ['user', 'cook', 'admin'], default: 'user' },
  address: { type: String, trim: true },
  area: { type: String, trim: true },
  status: { type: String, enum: ['Active', 'Inactive', 'Suspended'], default: 'Active' },
  // WALLET feature
  walletBalance: { type: Number, default: 0, min: 0 },
  walletTransactions: [{
    type: { type: String, enum: ['credit', 'debit'], required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now }
  }],
  // NUTRITION preferences
  dietaryGoal: { type: String, enum: ['weight_loss', 'muscle_gain', 'maintenance', 'healthy_eating'], default: 'healthy_eating' },
  dailyCalorieTarget: { type: Number, default: 2000 },
  allergies: [{ type: String }],
  // AI recommendation history
  lastRecommendations: { type: Date }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', userSchema);
