const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db');

require('dotenv').config({ path: './.env' });

/* =========================
   CONNECT DATABASE
========================= */
connectDB();

const app = express();


/* =========================
   CORS
========================= */
app.use(cors({
  origin: true,
  credentials: true
}));


/* =========================
   BODY PARSER
========================= */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


/* =========================
   STATIC FILES
   FIX: Only serve frontend/ folder instead of entire project root.
   Previously served __dirname which exposed .env, package.json, etc.
========================= */
app.use(express.static(path.join(__dirname, 'frontend')));


/* =========================
   FRONTEND
   FIX: Serve index.html from the frontend/ subdirectory
========================= */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});


/* =========================
   API ROUTES
========================= */
app.use('/api/auth',            require('./routes/auth'));
app.use('/api/users',           require('./routes/users'));
app.use('/api/cooks',           require('./routes/cooks'));
app.use('/api/menus',           require('./routes/menus'));
app.use('/api/orders',          require('./routes/orders'));
app.use('/api/subscriptions',   require('./routes/subscriptions'));
app.use('/api/reviews',         require('./routes/reviews'));
app.use('/api/admin',           require('./routes/admin'));
app.use('/api/categories',      require('./routes/categories'));
// NEW FEATURE ROUTES
app.use('/api/wallet',          require('./routes/wallet'));
app.use('/api/nutrition',       require('./routes/nutrition'));
app.use('/api/recommendations', require('./routes/recommendations'));
// FIX: Added missing notifications route
app.use('/api/notifications',   require('./routes/notifications'));


/* =========================
   HEALTH CHECK
========================= */
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'HomeFeast API is running', version: '2.0.0' });
});


/* =========================
   SPA FALLBACK
   FIX: Serve from frontend/ directory
========================= */
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});


/* =========================
   404 API
========================= */
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});


/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use(errorHandler);


/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
=================================
 HomeFeast Server v2.0 Running
 http://localhost:${PORT}
 New Features:
  ✅ Online Wallet (/api/wallet)
  ✅ Nutrition Tracking (/api/nutrition)
  ✅ AI Recommendations (/api/recommendations)
  ✅ Notifications (/api/notifications)
  ✅ Order Bug Fixed (/api/orders)
=================================
  `);
});
