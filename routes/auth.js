const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ firstName, lastName, email, phone, password, role: role || 'user' });
    const token = generateToken(user._id);

    res.cookie('token', token, { httpOnly: true, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), sameSite: 'lax' });
    res.status(201).json({
      success: true,
      message: role === 'cook' ? 'Registration submitted! Under admin review.' : 'Account created!',
      data: { id: user._id, name: user.fullName, email: user.email, role: user.role },
      token
    });
  } catch (err) { next(err); }
});

// POST /api/auth/login
// POST /api/auth/login
router.post('/login', async (req,res)=>{

  try{

    const {
      email,
      password,
      role
    } = req.body;

    const account = await User.findOne({
      email,
      role
    });

    if(!account){

      return res.status(401).json({
        success:false,
        message:'Invalid credentials'
      });
    }

    const bcrypt =
      require('bcryptjs');

    const isMatch =
      await bcrypt.compare(
        password,
        account.password
      );

    if(!isMatch){

      return res.status(401).json({
        success:false,
        message:'Invalid credentials'
      });
    }

    const token = jwt.sign(
      {
        id: account._id,
        role: account.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn:'7d'
      }
    );

    res.json({
      success:true,
      token,
      user:{
        id: account._id,
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        role: account.role
      }
    });

  }catch(err){

    console.error(err);

    res.status(500).json({
      success:false,
      message:'Server error'
    });
  }

});

// GET /api/auth/me
router.get('/me', require('../middleware/auth').protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
  res.json({ success: true, message: 'Logged out' });
});

module.exports = router;