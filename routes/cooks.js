const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const Cook = require('../models/Cook');
const Menu = require('../models/Menu');
const Order = require('../models/Order');
const Subscription = require('../models/Subscription');
const Review = require('../models/Review');
const { getSubscriptionEndDate } = require('../utils/helpers');


// GET /api/cooks — list approved cooks with filters
router.get('/', async (req, res, next) => {
  try {

    const {
      search,
      type,
      cuisine,
      price,
      plan,
      area,
      city,
      page = 1,
      limit = 12
    } = req.query;

    const filter = {
      status: 'approved'
    };

    // SEARCH
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: 'i'
          }
        },
        {
          cuisine: {
            $regex: search,
            $options: 'i'
          }
        },
        {
          area: {
            $regex: search,
            $options: 'i'
          }
        },
        {
          city: {
            $regex: search,
            $options: 'i'
          }
        },
        {
          serviceArea: {
            $elemMatch: {
              $regex: search,
              $options: 'i'
            }
          }
        }
      ];
    }

    // MEAL TYPE FILTER
    if (type && type !== 'all') {
      filter.types = {
        $in: [type]
      };
    }

    // CUISINE FILTER
    if (cuisine && cuisine !== 'all') {
      filter.cuisine = {
        $regex: cuisine,
        $options: 'i'
      };
    }

    // PRICE FILTER
    if (price) {

      if (price === 'budget') {
        filter['plans.daily'] = {
          $lt: 150
        };
      }

      if (price === 'mid') {
        filter['plans.daily'] = {
          $gte: 150,
          $lte: 250
        };
      }

      if (price === 'premium') {
        filter['plans.daily'] = {
          $gt: 250
        };
      }
    }

    // MEAL PLAN FILTER
    if (plan && plan !== 'all') {

      filter[
        `plans.${plan.toLowerCase()}`
      ] = {
        $gt: 0
      };
    }

    // AREA + SERVICE AREA FILTER
    if (area) {

      filter.$and = filter.$and || [];

      filter.$and.push({
        $or: [
          {
            area: {
              $regex: area,
              $options: 'i'
            }
          },
          {
            serviceArea: {
              $elemMatch: {
                $regex: area,
                $options: 'i'
              }
            }
          }
        ]
      });
    }

    // CITY FILTER
    if (city) {

      filter.city = {
        $regex: city,
        $options: 'i'
      };
    }

    const skip =
      (parseInt(page) - 1) *
      parseInt(limit);

    const cooks =
      await Cook.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({
          rating: -1,
          createdAt: -1
        });

    const total =
      await Cook.countDocuments(filter);

    res.json({
      success: true,
      page: parseInt(page),
      count: cooks.length,
      total,
      data: cooks
    });

  } catch (err) {
    next(err);
  }
});


// GET /api/cooks/:id — cook detail
router.get('/:id', async (req, res, next) => {
  try {

    const cook =
      await Cook.findById(req.params.id);

    if (!cook) {
      return res.status(404).json({
        success: false,
        message: 'Cook not found'
      });
    }

    const menu =
      await Menu.find({
        cook: cook._id
      }).sort({
        popular: -1
      });

    const reviews =
      await Review.find({
        cook: cook._id
      })
        .populate(
          'user',
          'firstName lastName'
        )
        .sort({
          createdAt: -1
        });

    const data =
      cook.toObject();

    data.menu = menu;
    data.reviews = reviews;

    res.json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
  }
});


// GET /api/cooks/dashboard/my
router.get(
  '/dashboard/my',
  protect,
  authorize('cook'),
  async (req, res, next) => {

    try {

      const cook =
        await Cook.findOne({
          user: req.user.id
        });

      if (!cook) {
        return res.status(404).json({
          success: false,
          message: 'Cook profile not found'
        });
      }

      const pendingOrders =
        await Order.countDocuments({
          cook: cook._id,
          status: 'Pending'
        });

      const activeSubscribers =
        await Subscription.countDocuments({
          cook: cook._id,
          status: 'Active'
        });

      const totalEarnings =
        await Order.aggregate([
          {
            $match: {
              cook: cook._id,
              status: {
                $ne: 'Cancelled'
              }
            }
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: '$amount'
              }
            }
          }
        ]);

      res.json({
        success: true,
        data: {
          cook,
          pendingOrders,
          activeSubscribers,
          totalEarnings:
            totalEarnings[0]?.total || 0
        }
      });

    } catch (err) {
      next(err);
    }
  }
);


// GET /api/cooks/orders/my
router.get(
  '/orders/my',
  protect,
  authorize('cook'),
  async (req, res, next) => {

    try {

      const cook =
        await Cook.findOne({
          user: req.user.id
        });

      if (!cook) {
        return res.status(404).json({
          success: false,
          message: 'Cook profile not found'
        });
      }

      const orders =
        await Order.find({
          cook: cook._id
        })
          .populate(
            'user',
            'firstName lastName area'
          )
          .sort({
            createdAt: -1
          });

      res.json({
        success: true,
        data: orders
      });

    } catch (err) {
      next(err);
    }
  }
);


// PUT /api/cooks/orders/:id
router.put(
  '/orders/:id',
  protect,
  authorize('cook'),
  async (req, res, next) => {

    try {

      const cook =
        await Cook.findOne({
          user: req.user.id
        });

      if (!cook) {
        return res.status(404).json({
          success: false,
          message: 'Cook profile not found'
        });
      }

      const order =
        await Order.findOne({
          _id: req.params.id,
          cook: cook._id
        });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      order.status =
        req.body.status;

      await order.save();

      res.json({
        success: true,
        message: 'Order updated',
        data: order
      });

    } catch (err) {
      next(err);
    }
  }
);


// GET /api/cooks/menu/my
router.get(
  '/menu/my',
  protect,
  authorize('cook'),
  async (req, res, next) => {

    try {

      const cook =
        await Cook.findOne({
          user: req.user.id
        });

      if (!cook) {
        return res.status(404).json({
          success: false,
          message: 'Cook profile not found'
        });
      }

      const menu =
        await Menu.find({
          cook: cook._id
        }).sort({
          createdAt: -1
        });

      res.json({
        success: true,
        data: menu
      });

    } catch (err) {
      next(err);
    }
  }
);


// POST /api/cooks/menu
router.post(
  '/menu',
  protect,
  authorize('cook'),
  async (req, res, next) => {

    try {

      const cook =
        await Cook.findOne({
          user: req.user.id
        });

      if (!cook) {
        return res.status(404).json({
          success: false,
          message: 'Cook profile not found'
        });
      }

      const item =
        await Menu.create({
          cook: cook._id,
          ...req.body
        });

      res.status(201).json({
        success: true,
        message: 'Menu item added',
        data: item
      });

    } catch (err) {
      next(err);
    }
  }
);


// PUT /api/cooks/menu/:id
router.put(
  '/menu/:id',
  protect,
  authorize('cook'),
  async (req, res, next) => {

    try {

      const cook =
        await Cook.findOne({
          user: req.user.id
        });

      if (!cook) {
        return res.status(404).json({
          success: false,
          message: 'Cook profile not found'
        });
      }

      const item =
        await Menu.findOneAndUpdate(
          {
            _id: req.params.id,
            cook: cook._id
          },
          req.body,
          {
            new: true,
            runValidators: true
          }
        );

      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Menu item not found'
        });
      }

      res.json({
        success: true,
        message: 'Menu updated',
        data: item
      });

    } catch (err) {
      next(err);
    }
  }
);


// DELETE /api/cooks/menu/:id
router.delete(
  '/menu/:id',
  protect,
  authorize('cook'),
  async (req, res, next) => {

    try {

      const cook =
        await Cook.findOne({
          user: req.user.id
        });

      if (!cook) {
        return res.status(404).json({
          success: false,
          message: 'Cook profile not found'
        });
      }

      const item =
        await Menu.findOneAndDelete({
          _id: req.params.id,
          cook: cook._id
        });

      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Menu item not found'
        });
      }

      res.json({
        success: true,
        message: 'Menu item deleted'
      });

    } catch (err) {
      next(err);
    }
  }
);


// PUT /api/cooks/profile/my
router.put(
  '/profile/my',
  protect,
  authorize('cook'),
  async (req, res, next) => {

    try {

      const cook =
        await Cook.findOneAndUpdate(
          {
            user: req.user.id
          },
          req.body,
          {
            new: true,
            runValidators: true
          }
        );

      if (!cook) {
        return res.status(404).json({
          success: false,
          message: 'Cook profile not found'
        });
      }

      res.json({
        success: true,
        message: 'Cook profile updated',
        data: cook
      });

    } catch (err) {
      next(err);
    }
  }
);


// POST /api/cooks/profile
router.post(
  '/profile',
  protect,
  authorize('cook'),
  async (req, res, next) => {

    try {

      let cook =
        await Cook.findOne({
          user: req.user.id
        });

      if (cook) {

        cook =
          await Cook.findOneAndUpdate(
            {
              user: req.user.id
            },
            {
              ...req.body,
              status: 'pending'
            },
            {
              new: true,
              runValidators: true
            }
          );

        return res.json({
          success: true,
          message:
            'Cook profile updated, sent for review',
          data: cook
        });
      }

      cook =
        await Cook.create({
          user: req.user.id,
          ...req.body,
          status: 'pending',
          verified: false
        });

      res.status(201).json({
        success: true,
        message:
          'Cook profile created, sent for review',
        data: cook
      });

    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;