const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db');

require('dotenv').config({
  path: './.env'
});

/* =========================
   CONNECT DATABASE
========================= */

connectDB();

const app = express();

/* =========================
   CORS
========================= */

app.use(
  cors({
    origin: 'http://localhost:5000',
    credentials: true
  })
);

/* =========================
   BODY PARSER
========================= */

app.use(
  express.json({
    limit: '10mb'
  })
);

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(cookieParser());

/* =========================
   STATIC FILES
========================= */

app.use(
  express.static(
    path.join(__dirname)
  )
);

/* =========================
   FRONTEND
========================= */

app.get('/', (req, res) => {

  res.sendFile(
    path.join(__dirname, 'index.html')
  );

});

/* =========================
   API ROUTES
========================= */

app.use(
  '/api/auth',
  require('./routes/auth')
);

app.use(
  '/api/users',
  require('./routes/users')
);

app.use(
  '/api/cooks',
  require('./routes/cooks')
);

/* ===== MENU ROUTE ADDED ===== */

app.use(
  '/api/menus',
  require('./routes/menus')
);

app.use(
  '/api/orders',
  require('./routes/orders')
);

app.use(
  '/api/subscriptions',
  require('./routes/subscriptions')
);

app.use(
  '/api/reviews',
  require('./routes/reviews')
);

app.use(
  '/api/admin',
  require('./routes/admin')
);

/* =========================
   HEALTH CHECK
========================= */

app.get('/api/health', (req, res) => {

  res.json({
    success: true,
    message: 'HomeFeast API is running'
  });

});

/* =========================
   SPA FALLBACK
========================= */

app.get('*', (req, res, next) => {

  if (req.path.startsWith('/api')) {

    return next();
  }

  res.sendFile(
    path.join(__dirname, 'index.html')
  );

});

/* =========================
   404 API
========================= */

app.use((req, res) => {

  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });

});

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use(errorHandler);

/* =========================
   SERVER
========================= */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`
=================================
 HomeFeast Server Running
 http://localhost:${PORT}
=================================
  `);

});