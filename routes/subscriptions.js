const express=require('express');
const router=express.Router();

const {
  protect,
  authorize
}=require('../middleware/auth');

const Subscription=
require('../models/Subscription');

const Cook=
require('../models/Cook');


router.get(
'/stats',
protect,
authorize('admin'),
async(req,res,next)=>{

try{

const active=
await Subscription.countDocuments({
status:'Accepted'
});

const total=
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


// USER CREATE SUBSCRIPTION

router.post(
'/',
protect,
authorize('user'),
async(req,res,next)=>{

try{

const sub=
await Subscription.create({
...req.body,
user:req.user.id
});

res.status(201).json({
success:true,
data:sub
});

}catch(err){
next(err);
}
});


// COOK VIEW REQUESTS

router.get(
'/cook/my',
protect,
authorize('cook'),
async(req,res,next)=>{

try{

const cook=
await Cook.findOne({
user:req.user.id
});

const subs=
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
data:subs
});

}catch(err){
next(err);
}
});


// ACCEPT

router.put(
'/:id/accept',
protect,
authorize('cook'),
async(req,res,next)=>{

try{

const sub=
await Subscription.findById(
req.params.id
);

if(!sub){
return res.status(404).json({
success:false
});
}

sub.status='Accepted';

await sub.save();

res.json({
success:true,
data:sub
});

}catch(err){
next(err);
}
});


// REJECT

router.put(
'/:id/reject',
protect,
authorize('cook'),
async(req,res,next)=>{

try{

const sub=
await Subscription.findById(
req.params.id
);

sub.status='Rejected';
sub.rejectionReason=
req.body.reason || '';

await sub.save();

res.json({
success:true,
data:sub
});

}catch(err){
next(err);
}
});

module.exports=router;