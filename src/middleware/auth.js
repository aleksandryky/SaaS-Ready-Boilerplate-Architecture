const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

// Simple JWT auth middleware
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload.user;
    req.tenantId = payload.tenantId;
    return next();
  } catch (e) {
    return res.status(401).json({ success: false, error: { message: 'Invalid token' } });
  }
};

