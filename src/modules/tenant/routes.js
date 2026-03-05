const express = require('express');

// In-memory tenants store; swap with DB later.
const tenants = [];

const router = express.Router();

router.post('/', (req, res) => {
  const { name, slug } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ success: false, error: { message: 'name and slug are required' } });
  }

  const existing = tenants.find((t) => t.slug === slug);
  if (existing) {
    return res.status(409).json({ success: false, error: { message: 'Tenant slug already exists' } });
  }

  const tenant = { id: tenants.length + 1, name, slug };
  tenants.push(tenant);

  return res.status(201).json({ success: true, data: { tenant } });
});

router.get('/', (req, res) => {
  return res.json({ success: true, data: { tenants } });
});

module.exports = router;

