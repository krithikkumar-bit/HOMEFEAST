const express = require('express');
const router = express.Router();

const Menu = require('../models/Menu');

// GET ALL MENUS
router.get('/', async (req, res) => {
    try {

        const menus = await Menu.find();

        res.json({
            success: true,
            data: menus
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// ADD MENU
router.post('/', async (req, res) => {

    try {

        const menu = await Menu.create(req.body);

        res.status(201).json({
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

// UPDATE MENU
router.put('/:id', async (req, res) => {

    try {

        const menu = await Menu.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
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
            data: menu
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

// DELETE MENU
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
            message: 'Menu deleted'
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

module.exports = router;