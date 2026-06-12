const express = require('express');
const router = express.Router();

const Menu = require('../models/Menu');

/* =========================
   GET ALL MENUS
========================= */
router.get('/', async (req, res) => {
    try {

        const menus = await Menu.find().populate('cook');

        res.json({
            success: true,
            count: menus.length,
            data: menus
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});


/* =========================
   GET SINGLE MENU
========================= */
router.get('/:id', async (req, res) => {

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

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});


/* =========================
   ADD MENU
========================= */
router.post('/', async (req, res) => {

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

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

});


/* =========================
   UPDATE MENU
========================= */
router.put('/:id', async (req, res) => {

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

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

});


/* =========================
   DELETE MENU
========================= */
router.delete('/:id', async (req, res) => {

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

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

module.exports = router;