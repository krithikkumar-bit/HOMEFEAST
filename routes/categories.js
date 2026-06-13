const express = require('express');
const router = express.Router();

const Category =
require('../models/category');

const {
protect,
authorize
} = require('../middleware/auth');

/* GET /api/categories — list all categories */
router.get('/',
async(req,res,next)=>{

 try{
  const categories =
  await Category.find();

  res.json({
    success:true,
    data:categories
  });
 }catch(err){
  next(err);
 }
});

/* POST /api/categories — create category (admin only) */
router.post('/',
protect,
authorize('admin'),
async(req,res,next)=>{

 try{
  const category =
  await Category.create(req.body);

  res.status(201).json({
    success:true,
    data:category
  });
 }catch(err){
  next(err);
 }
});

/* PUT /api/categories/:id — update category (admin only) */
router.put('/:id',
protect,
authorize('admin'),
async(req,res,next)=>{

 try{
  const category =
  await Category.findByIdAndUpdate(
   req.params.id,
   req.body,
   {new:true, runValidators:true}
  );

  if(!category){
   return res.status(404).json({
    success:false,
    message:'Category not found'
   });
  }

  res.json({
    success:true,
    data:category
  });
 }catch(err){
  next(err);
 }
});

/* DELETE /api/categories/:id — delete category (admin only) */
router.delete('/:id',
protect,
authorize('admin'),
async(req,res,next)=>{

 try{
  const category =
  await Category.findByIdAndDelete(
   req.params.id
  );

  if(!category){
   return res.status(404).json({
    success:false,
    message:'Category not found'
   });
  }

  res.json({
    success:true,
    message:'Deleted'
  });
 }catch(err){
  next(err);
 }
});

module.exports=router;
