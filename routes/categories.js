const express = require('express');
const router = express.Router();

const Category =
require('../models/Category');

const {
 protect,
 authorize
} = require('../middleware/auth');

router.get('/',
async(req,res)=>{

 const categories =
 await Category.find();

 res.json({
   success:true,
   data:categories
 });
});

router.post('/',
protect,
authorize('admin'),
async(req,res)=>{

 const category =
 await Category.create(req.body);

 res.status(201).json({
   success:true,
   data:category
 });
});

router.put('/:id',
protect,
authorize('admin'),
async(req,res)=>{

 const category =
 await Category.findByIdAndUpdate(
  req.params.id,
  req.body,
  {new:true}
 );

 res.json({
  success:true,
  data:category
 });
});

router.delete('/:id',
protect,
authorize('admin'),
async(req,res)=>{

 await Category.findByIdAndDelete(
  req.params.id
 );

 res.json({
  success:true,
  message:'Deleted'
 });
});

module.exports=router;