// Simple tenant resolver; in a real app you might:
// - Resolve from subdomain
// - Validate against DB
// Here we default to req.tenantId from auth or a header.

module.exports = (req, res, next) => {
  if (!req.tenantId) {
    const headerTenant = req.headers['x-tenant-id'];
    if (!headerTenant) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing tenant context' },
      });
    }
    req.tenantId = headerTenant;
  }
  return next();
};

