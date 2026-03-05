const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwtSecret } = require('../../config/env');

// In-memory demo "database". Replace with a real DB.
const users = [];

const router = express.Router();

router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, tenantId } = req.body;
    if (!email || !password || !tenantId) {
      return res.status(400).json({ success: false, error: { message: 'email, password and tenantId are required' } });
    }

    const existing = users.find((u) => u.email === email && u.tenantId === tenantId);
    if (existing) {
      return res.status(409).json({ success: false, error: { message: 'User already exists' } });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = { id: users.length + 1, email, password: hashed, tenantId, role: 'owner' };
    users.push(user);

    const token = jwt.sign({ user: { id: user.id, email: user.email }, tenantId }, jwtSecret, { expiresIn: '1h' });

    return res.status(201).json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, tenantId: user.tenantId, role: user.role },
        token,
      },
    });
  } catch (err) {
    return next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password, tenantId } = req.body;
    if (!email || !password || !tenantId) {
      return res.status(400).json({ success: false, error: { message: 'email, password and tenantId are required' } });
    }

    const user = users.find((u) => u.email === email && u.tenantId === tenantId);
    if (!user) {
      return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });
    }

    const token = jwt.sign({ user: { id: user.id, email: user.email }, tenantId }, jwtSecret, { expiresIn: '1h' });

    return res.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, tenantId: user.tenantId, role: user.role },
        token,
      },
    });
  } catch (err) {
    return next(err);
  }
});

router.get('/me', (req, res) => {
  // This route should be protected by auth + tenant middleware in app.js
  return res.json({
    success: true,
    data: {
      user: req.user || null,
      tenantId: req.tenantId || null,
    },
  });
});

module.exports = router;

