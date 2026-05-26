const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  cook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cook',
    required: true
  },

  plan: {
    type: String,
    enum: ['Daily','Weekly','Monthly'],
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: [
      'Pending',
      'Accepted',
      'Rejected',
      'Paused',
      'Cancelled',
      'Expired'
    ],
    default: 'Pending'
  },

  startDate: {
    type: Date,
    default: Date.now
  },

  endDate: Date,

  mealPreference: {
    type: [String],
    enum:['lunch','dinner'],
    default:['lunch']
  },

  deliveryAddress:String,

  rejectionReason:String

},{
  timestamps:true
});

module.exports =
mongoose.model(
  'Subscription',
  subscriptionSchema
);