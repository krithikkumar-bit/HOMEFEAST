// FIX: generateOrderId now finds the highest existing orderId to prevent
// duplicates when documents are deleted. Previously it used countDocuments
// which would produce duplicate IDs after any deletions.
const generateOrderId = async (Order) => {
  const lastOrder = await Order.findOne().sort({ orderId: -1 }).select('orderId');
  if (!lastOrder || !lastOrder.orderId) {
    return 'HF-1001';
  }
  // Extract numeric part from "HF-1001" and increment
  const numPart = parseInt(lastOrder.orderId.replace('HF-', ''), 10);
  return `HF-${numPart + 1}`;
};

const generateComplaintId = async (Complaint) => {
  // FIX: Same approach — find highest existing ID instead of counting
  const lastComplaint = await Complaint.findOne().sort({ complaintId: -1 }).select('complaintId');
  if (!lastComplaint || !lastComplaint.complaintId) {
    return 'CMP-001';
  }
  const numPart = parseInt(lastComplaint.complaintId.replace('CMP-', ''), 10);
  return `CMP-${String(numPart + 1).padStart(3, '0')}`;
};

const getSubscriptionEndDate = (plan) => {
  const now = new Date();
  const days = { Daily: 1, Weekly: 7, Monthly: 30 };
  return new Date(now.getTime() + (days[plan] || 7) * 24 * 60 * 60 * 1000);
};

module.exports = { generateOrderId, generateComplaintId, getSubscriptionEndDate };
