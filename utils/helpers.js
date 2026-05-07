const generateOrderId = async (Order) => {
  const count = await Order.countDocuments();
  return `HF-${1001 + count}`;
};

const generateComplaintId = async (Complaint) => {
  const count = await Complaint.countDocuments();
  return `CMP-${String(count + 1).padStart(3, '0')}`;
};

const getSubscriptionEndDate = (plan) => {
  const now = new Date();
  const days = { Daily: 1, Weekly: 7, Monthly: 30 };
  return new Date(now.getTime() + (days[plan] || 7) * 24 * 60 * 60 * 1000);
};

module.exports = { generateOrderId, generateComplaintId, getSubscriptionEndDate };