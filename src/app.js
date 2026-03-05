const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { corsOrigin, nodeEnv } = require('./config/env');
const authMiddleware = require('./middleware/auth');
const tenantMiddleware = require('./middleware/tenant');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./modules/auth/routes');
const tenantRoutes = require('./modules/tenant/routes');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: corsOrigin === '*' ? true : corsOrigin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan(nodeEnv === 'production' ? 'combined' : 'dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

// Public routes
app.use('/api/tenants', tenantRoutes);
app.use('/api/auth', authRoutes);

// Protected example route
app.get('/api/protected', authMiddleware, tenantMiddleware, (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Protected route access granted',
      user: req.user,
      tenantId: req.tenantId,
    },
  });
});

// Error handler must be last
app.use(errorHandler);

module.exports = app;

