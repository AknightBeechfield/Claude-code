const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'beechfield-dev-secret-change-in-production';
const JWT_EXPIRY = '7d';

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

// Middleware: require valid JWT
function requireAuth(req, res, next) {
  const token = req.cookies?.auth_token;
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Middleware: optionally attach user if token exists (for public routes)
function optionalAuth(req, res, next) {
  const token = req.cookies?.auth_token;
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      // Token invalid — continue without user
    }
  }
  next();
}

// Cookie options
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

module.exports = { generateToken, requireAuth, optionalAuth, COOKIE_OPTIONS, JWT_SECRET };
