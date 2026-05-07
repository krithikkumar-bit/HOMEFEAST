const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, unique: true, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cook: { type: mongoose.Schema.Types.ObjectId, ref: 'Cook' },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  issue: { type: String, required: [true, 'Describe the issue'], trim: true, maxlength: 1000 },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
  resolution: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);