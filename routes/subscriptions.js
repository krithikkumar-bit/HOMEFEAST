const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const Subscription = require('../models/Subscription');
const Cook = require('../models/Cook');

/* =========================
   CREATE SUBSCRIPTION
========================= */
router.post('/', protect, async (req, res, next) => {
    try {

        const subscription = await Subscription.create({
            user: req.user.id,
            cook: req.body.cook,
            plan: req.body.plan,
            amount: req.body.amount,
            mealPreference:
                req.body.mealPreference || ['lunch', 'dinner'],
            deliveryAddress:
                req.body.deliveryAddress || ''
        });

        res.status(201).json({
            success: true,
            data: subscription
        });

    } catch (err) {
        next(err);
    }
});

/* =========================
   MY SUBSCRIPTIONS (for users)
========================= */
router.get('/my', protect, async (req, res, next) => {
    try {

        const subscriptions = await Subscription
            .find({
                user: req.user.id
            })
            .populate(
                'cook',
                'name image cuisine area'
            )
            .sort({
                createdAt: -1
            });

        res.json({
            success: true,
            count: subscriptions.length,
            data: subscriptions
        });

    } catch (err) {
        next(err);
    }
});

/* =========================
   COOK'S SUBSCRIPTIONS
   GET /api/subscriptions/cook/my
   FIX: New endpoint for cooks to see their own subscribers
========================= */
router.get(
    '/cook/my',
    protect,
    authorize('cook'),
    async (req, res, next) => {
        try {
            const cook = await Cook.findOne({ user: req.user.id });
            if (!cook) {
                return res.status(404).json({
                    success: false,
                    message: 'Cook profile not found'
                });
            }

            const subs = await Subscription
                .find({ cook: cook._id })
                .populate('user', 'firstName lastName email area')
                .populate('cook', 'name cuisine area')
                .sort({ createdAt: -1 });

            res.json({
                success: true,
                count: subs.length,
                data: subs
            });

        } catch (err) {
            next(err);
        }
    }
);

/* =========================
   ADMIN STATS
========================= */
router.get(
    '/stats',
    protect,
    authorize('admin'),
    async (req, res, next) => {
        try {

            const active =
                await Subscription.countDocuments({
                    status: 'Active'
                });

            const total =
                await Subscription.countDocuments();

            const planBreakdown =
                await Subscription.aggregate([
                    {
                        $match: {
                            status: 'Active'
                        }
                    },
                    {
                        $group: {
                            _id: '$plan',
                            count: { $sum: 1 }
                        }
                    }
                ]);

            res.json({
                success: true,
                data: {
                    active,
                    total,
                    planBreakdown
                }
            });

        } catch (err) {
            next(err);
        }
    }
);

/* =========================
   ADMIN ALL SUBSCRIPTIONS
   FIX: Also support cookId query parameter for cook dashboard
========================= */
router.get(
    '/',
    protect,
    async (req, res, next) => {
        try {
            // Allow both admin and cook roles
            // Cooks can only see subscriptions for their own cook profile
            let filter = {};

            if (req.user.role === 'admin') {
                // Admin can see all subscriptions, optionally filtered by cookId
                if (req.query.cookId) {
                    filter.cook = req.query.cookId;
                }
            } else if (req.user.role === 'cook') {
                // Cook can only see their own subscriptions
                const cook = await Cook.findOne({ user: req.user.id });
                if (!cook) {
                    return res.status(404).json({
                        success: false,
                        message: 'Cook profile not found'
                    });
                }
                filter.cook = cook._id;
            } else {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized'
                });
            }

            const subs =
                await Subscription.find(filter)
                    .populate(
                        'user',
                        'firstName lastName email area'
                    )
                    .populate(
                        'cook',
                        'name cuisine area'
                    )
                    .sort({
                        createdAt: -1
                    });

            res.json({
                success: true,
                data: subs
            });

        } catch (err) {
            next(err);
        }
    }
);

module.exports = router;
