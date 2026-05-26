const express = require('express');
const router = express.Router();

const {
  protect,
  authorize
} = require('../middleware/auth');

const Subscription =
require('../models/Subscription');

const Cook =
require('../models/Cook');


// =============================
// ADMIN SUBSCRIPTION STATS
// =============================

router.get(
'/stats',
protect,
authorize('admin'),
async(req,res,next)=>{

try{

const active =
await Subscription.countDocuments({
status:'Accepted'
});

const total =
await Subscription.countDocuments();

res.json({
success:true,
data:{
active,
total
}
});

}catch(err){
next(err);
}
});


// =============================
// USER CREATE SUBSCRIPTION
// =============================

router.post(
'/',
protect,
authorize('user'),
async(req,res,next)=>{

try{

const sub =
await Subscription.create({
...req.body,
user:req.user.id,
status:'Pending'
});

res.status(201).json({
success:true,
data:sub
});

}catch(err){
next(err);
}
});


// =============================
// USER VIEW OWN SUBSCRIPTIONS
// =============================

router.get(
'/my',
protect,
authorize('user'),
async(req,res,next)=>{

try{

const subs =
await Subscription.find({
user:req.user.id
})
.populate(
'cook'
)
.sort({
createdAt:-1
});

res.json({
success:true,
count:subs.length,
data:subs
});

}catch(err){
next(err);
}
});


// =============================
// COOK VIEW REQUESTS
// =============================

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

const subs =
await Subscription.find({
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
count:subs.length,
data:subs
});

}catch(err){
next(err);
}
});


// =============================
// ACCEPT SUBSCRIPTION
// =============================

router.put(
'/:id/accept',
protect,
authorize('cook'),
async(req,res,next)=>{

try{

const sub =
await Subscription.findById(
req.params.id
);

if(!sub){
return res.status(404).json({
success:false,
message:'Subscription not found'
});
}

sub.status='Accepted';

await sub.save();

res.json({
success:true,
message:'Subscription accepted',
data:sub
});

}catch(err){
next(err);
}
});


// =============================
// REJECT SUBSCRIPTION
// =============================

router.put(
'/:id/reject',
protect,
authorize('cook'),
async(req,res,next)=>{

try{

const sub =
await Subscription.findById(
req.params.id
);

if(!sub){
return res.status(404).json({
success:false,
message:'Subscription not found'
});
}

sub.status='Rejected';

sub.rejectionReason =
req.body.reason || '';

await sub.save();

res.json({
success:true,
message:'Subscription rejected',
data:sub
});

}catch(err){
next(err);
}
});


// =============================
// COOK DASHBOARD STATS
// =============================

router.get(
'/cook/stats',
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

const totalSubs =
await Subscription.countDocuments({
cook:cook._id
});

const pending =
await Subscription.countDocuments({
cook:cook._id,
status:'Pending'
});

const active =
await Subscription.countDocuments({
cook:cook._id,
status:'Accepted'
});

const acceptedSubs =
await Subscription.find({
cook:cook._id,
status:'Accepted'
});

let earnings = 0;

acceptedSubs.forEach(sub=>{
earnings += sub.amount;
});

res.json({
success:true,
data:{
totalSubs,
pending,
active,
earnings
}
});

}catch(err){
next(err);
}
});


// =============================
// EXPORT
// =============================

module.exports = router;