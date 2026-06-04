const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

/* GET /api/wallet — get balance & transactions */
router.get('/', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('walletBalance walletTransactions firstName lastName');
    res.json({
      success: true,
      data: {
        balance: user.walletBalance || 0,
        transactions: (user.walletTransactions || []).slice(-50).reverse()
      }
    });
  } catch (err) { next(err); }
});

/* POST /api/wallet/add — add money (simulate payment gateway) */
router.post('/add', protect, async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0 || amount > 50000) {
      return res.status(400).json({ success: false, message: 'Invalid amount. Must be ₹1–₹50,000.' });
    }

    const user = await User.findById(req.user.id);
    user.walletBalance = (user.walletBalance || 0) + Number(amount);
    user.walletTransactions.push({
      type: 'credit',
      amount: Number(amount),
      description: `Added to wallet via online payment`
    });
    await user.save();

    res.json({
      success: true,
      message: `₹${amount} added to wallet`,
      data: { balance: user.walletBalance }
    });
  } catch (err) { next(err); }
});

module.exports = router;
