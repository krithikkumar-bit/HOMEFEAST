const express=require('express');
const router=express.Router();

const {
protect
}=require('../middleware/auth');

const Notification=
require('../models/Notification');


router.get(
'/',
protect,
async(req,res,next)=>{

try{

const data=
await Notification.find({
user:req.user.id
})
.sort({
createdAt:-1
});

res.json({
success:true,
data
});

}catch(err){
next(err);
}
});


module.exports=router;