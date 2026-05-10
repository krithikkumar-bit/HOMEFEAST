const express = require('express');

const router = express.Router();

const Menu = require('../models/Menu');

// GET ALL MENUS
router.get('/', async (req, res) => {

    try {

        const menus = await Menu.find();

        res.json(menus);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

module.exports = router;