const express = require('express');
const router = express.Router();

const {
  protect,
  authorize
} = require('../middleware/auth');

const Order =
require('../models/Order');

const Cook =
require('../models/Cook');


// ====================================
// USER PLACE ORDER
// ====================================

router.post(
'/',
protect,
authorize('user'),
async(req,res,next)=>{

try{

const order =
await Order.create({
...req.body,
user:req.user.id
});

res.status(201).json({
success:true,
data:order
});

}catch(err){
next(err);
}
});


// ====================================
// USER ORDER HISTORY
// ====================================

router.get(
'/my',
protect,
authorize('user'),
async(req,res,next)=>{

try{

const orders =
await Order.find({
user:req.user.id
})
.populate('cook')
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


// ====================================
// SINGLE ORDER
// ====================================

router.get(
'/:id',
protect,
async(req,res,next)=>{

try{

const order =
await Order.findById(
req.params.id
)
.populate('user')
.populate('cook');

if(!order){
return res.status(404).json({
success:false,
message:'Order not found'
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


// ====================================
// COOK ORDERS DASHBOARD
// ====================================

router.get(
'/cook/my',
protect,
authorize('cook'),
async(req,res,next)=>{

try{

const cook =
await Cook.findOne({
user:req.user.id
});

if(!cook){
return res.status(404).json({
success:false,
message:'Cook not found'
});
}

const orders =
await Order.find({
cook:cook._id
})
.populate(
'user',
'firstName lastName email'
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


// ====================================
// COOK UPDATE ORDER STATUS
// ====================================

router.put(
'/:id/status',
protect,
authorize('cook','admin'),
async(req,res,next)=>{

try{

const order =
await Order.findById(
req.params.id
);

if(!order){
return res.status(404).json({
success:false,
message:'Order not found'
});
}

order.status =
req.body.status ||
order.status;

await order.save();

res.json({
success:true,
message:'Order updated',
data:order
});

}catch(err){
next(err);
}
});


// ====================================
// ADMIN ALL ORDERS
// ====================================

router.get(
'/',
protect,
authorize('admin'),
async(req,res,next)=>{

try{

const orders =
await Order.find()
.populate(
'user',
'firstName lastName email'
)
.populate('cook')
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


// ====================================
// EXPORT
// ====================================

module.exports = router;