const express = require('express');
const router = express.Router();

const Menu = require('../models/Menu');

// FIX: Import auth middleware for protecting write routes
const { protect, authorize } = require('../middleware/auth');

/* =========================
   GET ALL MENUS
========================= */
router.get('/', async (req, res, next) => {
    try {

        const menus = await Menu.find().populate('cook');

        res.json({
            success: true,
            count: menus.length,
            data: menus
        });

    } catch (err) {
        next(err);
    }
});


/* =========================
   GET SINGLE MENU
========================= */
router.get('/:id', async (req, res, next) => {

    try {

        const menu = await Menu.findById(req.params.id)
            .populate('cook');

        if (!menu) {

            return res.status(404).json({
                success: false,
                message: 'Menu not found'
            });

        }

        res.json({
            success: true,
            data: menu
        });

    } catch (err) {
        next(err);
    }

});


/* =========================
   ADD MENU
   FIX: Added auth protection — only admin/cook can add menus
========================= */
router.post('/', protect, authorize('admin', 'cook'), async (req, res, next) => {

    try {

        const {
            cook,
            name,
            image,
            type,
            price,
            description,
            category
        } = req.body;

        const menu = await Menu.create({
            cook,
            name,
            image,
            type,
            price,
            description,
            category
        });

        res.status(201).json({
            success: true,
            message: 'Menu added successfully',
            data: menu
        });

    } catch (err) {
        next(err);
    }

});


/* =========================
   UPDATE MENU
   FIX: Added auth protection — only admin/cook can update menus
========================= */
router.put('/:id', protect, authorize('admin', 'cook'), async (req, res, next) => {

    try {

        const menu = await Menu.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!menu) {

            return res.status(404).json({
                success: false,
                message: 'Menu not found'
            });

        }

        res.json({
            success: true,
            message: 'Menu updated successfully',
            data: menu
        });

    } catch (err) {
        next(err);
    }

});


/* =========================
   DELETE MENU
   FIX: Added auth protection — only admin/cook can delete menus
========================= */
router.delete('/:id', protect, authorize('admin', 'cook'), async (req, res, next) => {

    try {

        const menu = await Menu.findByIdAndDelete(
            req.params.id
        );

        if (!menu) {

            return res.status(404).json({
                success: false,
                message: 'Menu not found'
            });

        }

        res.json({
            success: true,
            message: 'Menu deleted successfully'
        });

    } catch (err) {
        next(err);
    }

});

module.exports = router;
