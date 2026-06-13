const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const Subscription = require('../models/Subscription');

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
   MY SUBSCRIPTIONS
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
========================= */
router.get(
    '/',
    protect,
    authorize('admin'),
    async (req, res, next) => {
        try {

            const subs =
                await Subscription.find()
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