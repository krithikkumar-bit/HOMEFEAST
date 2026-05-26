const express = require('express');
const router = express.Router();

const {
  protect,
  authorize
} = require('../middleware/auth');

const Complaint =
require('../models/Complaint');


// ==========================
// USER CREATE COMPLAINT
// ==========================

router.post(
'/',
protect,
authorize('user'),
async(req,res,next)=>{

try{

const complaint =
await Complaint.create({
...req.body,
user:req.user.id,
status:'Open'
});

res.status(201).json({
success:true,
data:complaint
});

}catch(err){
next(err);
}
});


// ==========================
// USER MY COMPLAINTS
// ==========================

router.get(
'/my',
protect,
authorize('user'),
async(req,res,next)=>{

try{

const complaints =
await Complaint.find({
user:req.user.id
})
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


// ==========================
// ADMIN ALL COMPLAINTS
// ==========================

router.get(
'/',
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


// ==========================
// ADMIN UPDATE COMPLAINT
// ==========================

router.put(
'/:id',
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