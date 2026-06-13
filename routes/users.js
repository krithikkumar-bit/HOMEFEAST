const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');

const User = require('../models/User');
const Order = require('../models/Order');
const Subscription = require('../models/Subscription');
const Complaint = require('../models/Complaint');

const { generateComplaintId } = require('../utils/helpers');

router.use(protect);

/* ===================================
   GET ALL USERS (ADMIN PANEL)
=================================== */
router.get('/', async (req, res, next) => {

  try {

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users
    });

  } catch (err) {

    next(err);

  }

});

/* ===================================
   USER DASHBOARD
=================================== */
router.get('/dashboard', async (req, res, next) => {

  try {

    const activeSubs =
      await Subscription.countDocuments({
        user: req.user.id,
        status: 'Active'
      });

    const totalOrders =
      await Order.countDocuments({
        user: req.user.id
      });

    // FIX: Also sum 'total' field for accurate spent amount (cart orders use 'total')
    const totalSpent =
      await Order.aggregate([
        {
          $match: {
            user: req.user._id,
            status: { $nin: ['cancelled', 'Cancelled'] }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' }
          }
        }
      ]);

    const cooksTried =
      await Order.distinct(
        'cook',
        { user: req.user.id }
      );

    res.json({
      success: true,
      data: {
        activeSubscriptions: activeSubs,
        totalOrders,
        totalSpent: totalSpent[0]?.total || 0,
        cooksTried: cooksTried.length
      }
    });

  } catch (err) {

    next(err);

  }

});

/* ===================================
   UPDATE PROFILE
=================================== */
router.put('/profile', async (req, res, next) => {

  try {

    const user =
      await User.findByIdAndUpdate(
        req.user.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    res.json({
      success: true,
      message: 'Profile updated',
      data: user
    });

  } catch (err) {

    next(err);

  }

});

/* ===================================
   GET SUBSCRIPTIONS
=================================== */
router.get('/subscriptions', async (req, res, next) => {

  try {

    const subs =
      await Subscription.find({
        user: req.user.id
      })
      .populate(
        'cook',
        'name cuisine avatar area plans'
      )
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: subs
    });

  } catch (err) {

    next(err);

  }

});

/* ===================================
   PAUSE SUBSCRIPTION
=================================== */
router.put('/subscriptions/:id/pause', async (req, res, next) => {

  try {

    const sub =
      await Subscription.findOne({
        _id: req.params.id,
        user: req.user.id,
        status: 'Active'
      });

    if (!sub) {

      return res.status(404).json({
        success: false,
        message: 'Active subscription not found'
      });

    }

    sub.status = 'Paused';
    sub.pausedAt = new Date();

    await sub.save();

    res.json({
      success: true,
      message: 'Subscription paused',
      data: sub
    });

  } catch (err) {

    next(err);

  }

});

/* ===================================
   GET USER ORDERS
=================================== */
router.get('/orders', async (req, res, next) => {

  try {

    const orders =
      await Order.find({
        user: req.user.id
      })
      .populate(
        'cook',
        'name cuisine avatar'
      )
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });

  } catch (err) {

    next(err);

  }

});

/* ===================================
   CREATE COMPLAINT
=================================== */
router.post('/complaints', async (req, res, next) => {

  try {

    const complaintId =
      await generateComplaintId(
        Complaint
      );

    const complaint =
      await Complaint.create({
        complaintId,
        user: req.user.id,
        cook: req.body.cookId,
        order: req.body.orderId,
        issue: req.body.issue
      });

    res.status(201).json({
      success: true,
      message: 'Complaint filed',
      data: complaint
    });

  } catch (err) {

    next(err);

  }

});
// GET ALL USERS (ADMIN)
router.get('/', async (req, res) => {
  try {

    const users = await User.find()
      .select('-password');

    res.json({
      success: true,
      data: users
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
});

module.exports = router;