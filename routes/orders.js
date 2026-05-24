const express = require('express');
const router = express.Router();

const { protect } =
require('../middleware/auth');

const Order =
require('../models/Order');

const Cook =
require('../models/Cook');

const Subscription =
require('../models/Subscription');

const {
  generateOrderId,
  getSubscriptionEndDate
} = require('../utils/helpers');


/* =========================
   GET ALL ORDERS
========================= */

router.get('/',
async (req,res,next)=>{

  try{

    const orders =
    await Order.find()
      .populate('cook')
      .populate('user');

    res.json({
      success:true,
      data:orders
    });

  }catch(err){
    next(err);
  }

});


/* =========================
   USER ORDER HISTORY
   GET /api/orders/my
========================= */

router.get('/my',
protect,
async(req,res,next)=>{

  try{

    const orders =
    await Order.find({
      user:req.user.id
    })
    .populate(
      'cook',
      'name cuisine area avatar'
    )
    .sort({
      createdAt:-1
    });

    res.json({
      success:true,
      count:orders.length,
      data:orders
    });

  }catch(err){
    next(err);
  }

});


/* =========================
   CREATE ORDER
========================= */

router.post('/',
protect,
async(req,res,next)=>{

  try{

    const {
      cookId,
      plan,
      meal,
      mealPreference,
      deliveryAddress
    } = req.body;

    const cook =
    await Cook.findById(cookId);

    if(!cook){

      return res.status(404).json({
        success:false,
        message:'Cook not found'
      });

    }

    if(cook.status !== 'approved'){

      return res.status(400).json({
        success:false,
        message:'Cook not approved'
      });

    }

    const amount =
    cook.plans?.[
      plan?.toLowerCase()
    ] || 0;

    const orderId =
    await generateOrderId(Order);

    const startDate =
    new Date(
      Date.now() +
      24*60*60*1000
    );

    const endDate =
    plan !== 'Daily'
      ? getSubscriptionEndDate(plan)
      : undefined;

    const order =
    await Order.create({

      orderId,

      user:req.user.id,

      cook:cookId,

      meal,

      plan,

      amount,

      status:'Pending',

      deliveryAddress:
        deliveryAddress ||
        req.user.address,

      mealPreference:
        mealPreference ||
        ['lunch'],

      startDate,

      endDate
    });

    // Daily order auto active
    if(plan === 'Daily'){

      order.status='Active';

      await order.save();

      cook.totalEarnings += amount;

      await cook.save();

    }

    res.status(201).json({

      success:true,

      message:
      plan === 'Daily'
        ? 'Daily meal ordered!'
        : 'Subscription request sent.',

      data:order

    });

  }catch(err){

    next(err);

  }

});


/* =========================
   GET SINGLE ORDER
========================= */

router.get('/:id',
protect,
async(req,res,next)=>{

  try{

    const order =
    await Order.findById(
      req.params.id
    )
    .populate('cook')
    .populate('user');

    if(!order){

      return res.status(404).json({
        success:false,
        message:'Order not found'
      });

    }

    // Security check
    if(
      order.user._id.toString()
      !==
      req.user.id
    ){

      return res.status(403).json({
        success:false,
        message:'Unauthorized'
      });

    }

    res.json({
      success:true,
      data:order
    });

  }catch(err){

    next(err);

  }

});


/* =========================
   CANCEL ORDER
========================= */

router.put('/:id/cancel',
protect,
async(req,res,next)=>{

  try{

    const order =
    await Order.findOne({

      _id:req.params.id,

      user:req.user.id

    });

    if(!order){

      return res.status(404).json({
        success:false,
        message:'Order not found'
      });

    }

    order.status =
    'Cancelled';

    await order.save();

    await Subscription.updateMany(

      {
        user:order.user,
        cook:order.cook
      },

      {
        status:'Cancelled'
      }

    );

    res.json({

      success:true,

      message:'Order cancelled',

      data:order

    });

  }catch(err){

    next(err);

  }

});

module.exports = router;