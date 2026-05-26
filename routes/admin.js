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

const Category =
require('../models/Category');


// ==============================
// ADMIN SUMMARY DASHBOARD
// ==============================

router.get(
'/dashboard',
protect,
authorize('admin'),
async(req,res,next)=>{

try{

const users =
await User.countDocuments();

const cooks =
await Cook.countDocuments();

const orders =
await Order.countDocuments();

const complaints =
await Complaint.countDocuments();

res.json({
success:true,
data:{
users,
cooks,
orders,
complaints
}
});

}catch(err){
next(err);
}
});


// ==============================
// ALL USERS
// ==============================

router.get(
'/users',
protect,
authorize('admin'),
async(req,res,next)=>{

try{

const users =
await User.find()
.sort({
createdAt:-1
});

res.json({
success:true,
count:users.length,
data:users
});

}catch(err){
next(err);
}
});


// ==============================
// ALL COOKS
// ==============================

router.get(
'/cooks',
protect,
authorize('admin'),
async(req,res,next)=>{

try{

const cooks =
await Cook.find()
.sort({
createdAt:-1
});

res.json({
success:true,
count:cooks.length,
data:cooks
});

}catch(err){
next(err);
}
});


// ==============================
// CATEGORY CREATE
// ==============================

router.post(
'/categories',
protect,
authorize('admin'),
async(req,res,next)=>{

try{

const category =
await Category.create({
name:req.body.name
});

res.status(201).json({
success:true,
data:category
});

}catch(err){
next(err);
}
});


// ==============================
// CATEGORY LIST
// ==============================

router.get(
'/categories',
protect,
authorize('admin'),
async(req,res,next)=>{

try{

const categories =
await Category.find();

res.json({
success:true,
count:categories.length,
data:categories
});

}catch(err){
next(err);
}
});


// ==============================
// DELETE CATEGORY
// ==============================

router.delete(
'/categories/:id',
protect,
authorize('admin'),
async(req,res,next)=>{

try{

await Category.findByIdAndDelete(
req.params.id
);

res.json({
success:true,
message:'Category deleted'
});

}catch(err){
next(err);
}
});


// ==============================
// COMPLAINTS
// ==============================

router.get(
'/complaints',
protect,
authorize('admin'),
async(req,res,next)=>{

try{

const complaints =
await Complaint.find()
.populate(
'user',
'firstName lastName email'
)
.sort({
createdAt:-1
});

res.json({
success:true,
count:complaints.length,
data:complaints
});

}catch(err){
next(err);
}
});


// ==============================
// UPDATE COMPLAINT STATUS
// ==============================

router.put(
'/complaints/:id',
protect,
authorize('admin'),
async(req,res,next)=>{

try{

const complaint =
await Complaint.findById(
req.params.id
);

if(!complaint){
return res.status(404).json({
success:false,
message:'Complaint not found'
});
}

complaint.status =
req.body.status ||
complaint.status;

await complaint.save();

res.json({
success:true,
data:complaint
});

}catch(err){
next(err);
}
});

module.exports = router;