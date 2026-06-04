const express = require('express');
const router = express.Router();

const {
  protect,
  authorize
} = require('../middleware/auth');

const User =
require('../models/User');

const Cook =
require('../models/Cook');

const Order =
require('../models/Order');

const Complaint =
require('../models/Complaint');

const Menu =
require('../models/Menu');

const Subscription =
require('../models/Subscription');


/* =========================
   ADMIN PROTECTION
========================= */

router.use(
  protect,
  authorize('admin')
);


/* =========================
   KPI DASHBOARD
========================= */

router.get('/kpi',
async(req,res,next)=>{

  try{

    const users =
    await User.countDocuments({
      role:'user'
    });

    const cooks =
    await Cook.countDocuments();

    const activeSubscriptions =
    await Subscription.countDocuments({
      status:'Active'
    });

    const orders =
    await Order.countDocuments();

    const completedOrders =
    await Order.countDocuments({
      status:'Completed'
    });

    const conversionRate =
    orders
      ? (
        (completedOrders/orders)
        *100
      ).toFixed(2)
      : 0;

    res.json({
      success:true,
      data:{
        users,
        cooks,
        activeSubscriptions,
        orders,
        conversionRate
      }
    });

  }catch(err){
    next(err);
  }

});


/* =========================
   ADMIN STATS
========================= */

router.get('/stats',
async(req,res,next)=>{

  try{

    const totalCooks =
    await Cook.countDocuments();

    const pendingCooks =
    await Cook.countDocuments({
      status:'pending'
    });

    const totalUsers =
    await User.countDocuments({
      role:'user'
    });

    const activeOrders =
    await Order.countDocuments({
      status:'Active'
    });

    const openComplaints =
    await Complaint.countDocuments({
      status:'Open'
    });

    const totalRevenue =
    await Order.aggregate([
      {
        $match:{
          status:{
            $ne:'Cancelled'
          }
        }
      },
      {
        $group:{
          _id:null,
          total:{
            $sum:'$amount'
          }
        }
      }
    ]);

    res.json({

      success:true,

      data:{
        totalCooks,
        pendingCooks,
        totalUsers,
        activeOrders,
        openComplaints,
        totalRevenue:
          totalRevenue[0]?.total || 0
      }

    });

  }catch(err){
    next(err);
  }

});


/* =========================
   GET ALL COOKS
========================= */

router.get('/cooks',
async(req,res,next)=>{

  try{

    const cooks =
    await Cook.find()
      .populate(
        'user',
        'firstName lastName email phone status'
      )
      .sort({
        createdAt:-1
      });

    res.json({
      success:true,
      data:cooks
    });

  }catch(err){
    next(err);
  }

});


/* =========================
   UPDATE COOK STATUS
========================= */

router.put('/cooks/:id/status',
async(req,res,next)=>{

  try{

    const { status } =
    req.body;

    if(
      ![
        'approved',
        'pending',
        'suspended'
      ].includes(status)
    ){

      return res.status(400).json({
        success:false,
        message:'Invalid status'
      });

    }

    const cook =
    await Cook.findByIdAndUpdate(

      req.params.id,

      {
        status,
        verified:
        status === 'approved'
      },

      {
        new:true
      }

    );

    if(!cook){

      return res.status(404).json({
        success:false,
        message:'Cook not found'
      });

    }

    await User.findByIdAndUpdate(

      cook.user,

      {
        status:
        status === 'suspended'
        ? 'Suspended'
        : 'Active'
      }

    );

    res.json({

      success:true,

      message:
      `Cook ${status}`,

      data:cook

    });

  }catch(err){
    next(err);
  }

});


/* =========================
   DELETE COOK
========================= */

router.delete('/cooks/:id',
async(req,res,next)=>{

  try{

    const cook =
    await Cook.findByIdAndDelete(
      req.params.id
    );

    if(!cook){

      return res.status(404).json({
        success:false,
        message:'Cook not found'
      });

    }

    await Menu.deleteMany({
      cook:cook._id
    });

    res.json({
      success:true,
      message:'Cook deleted'
    });

  }catch(err){
    next(err);
  }

});


/* =========================
   GET USERS
========================= */

router.get('/users',
async(req,res,next)=>{

  try{

    const users =
    await User.find({
      role:'user'
    }).sort({
      createdAt:-1
    });

    const result =
    await Promise.all(

      users.map(
        async(u)=>{

          const orderCount =
          await Order.countDocuments({
            user:u._id
          });

          return {
            ...u.toObject(),
            orderCount
          };

        }
      )

    );

    res.json({
      success:true,
      data:result
    });

  }catch(err){
    next(err);
  }

});


/* =========================
   UPDATE USER STATUS
========================= */

router.put('/users/:id/status',
async(req,res,next)=>{

  try{

    const { status } =
    req.body;

    if(
      ![
        'Active',
        'Inactive',
        'Suspended'
      ].includes(status)
    ){

      return res.status(400).json({
        success:false,
        message:'Invalid status'
      });

    }

    const user =
    await User.findByIdAndUpdate(

      req.params.id,

      { status },

      { new:true }

    );

    if(!user){

      return res.status(404).json({
        success:false,
        message:'User not found'
      });

    }

    res.json({

      success:true,

      message:
      `User ${status.toLowerCase()}`,

      data:user

    });

  }catch(err){
    next(err);
  }

});


/* =========================
   GET ALL ORDERS
========================= */

router.get('/orders',
async(req,res,next)=>{

  try{

    const orders =
    await Order.find()
      .populate(
        'user',
        'firstName lastName area'
      )
      .populate(
        'cook',
        'name cuisine'
      )
      .sort({
        createdAt:-1
      });

    res.json({
      success:true,
      data:orders
    });

  }catch(err){
    next(err);
  }

});


/* =========================
   GET COMPLAINTS
========================= */

router.get('/complaints',
async(req,res,next)=>{

  try{

    const complaints =
    await Complaint.find()
      .populate(
        'user',
        'firstName lastName'
      )
      .populate(
        'cook',
        'name'
      )
      .populate(
        'order',
        'orderId meal'
      )
      .sort({
        createdAt:-1
      });

    res.json({
      success:true,
      data:complaints
    });

  }catch(err){
    next(err);
  }

});


/* =========================
   UPDATE COMPLAINT
========================= */

router.put('/complaints/:id',
async(req,res,next)=>{

  try{

    const {
      status,
      resolution
    } = req.body;

    const complaint =
    await Complaint.findByIdAndUpdate(

      req.params.id,

      {
        status,
        resolution:
          resolution || ''
      },

      {
        new:true
      }

    );

    if(!complaint){

      return res.status(404).json({
        success:false,
        message:'Complaint not found'
      });

    }

    res.json({

      success:true,

      message:
      `Complaint ${status}`,

      data:complaint

    });

  }catch(err){
    next(err);
  }

});

module.exports = router;