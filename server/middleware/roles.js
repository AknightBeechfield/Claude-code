// Role hierarchy for access control
const ROLE_HIERARCHY = {
  admin: 100,
  website_manager: 90,
  digital_editor: 80,
  product_editor: 70,
  editorial_editor: 60,
  reviewer: 50,
  legal_reviewer: 40,
  user: 10,
};

// Middleware: require minimum role level
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (allowedRoles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ error: 'Insufficient permissions' });
  };
}

// Middleware: require admin
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = { requireRole, requireAdmin, ROLE_HIERARCHY };
