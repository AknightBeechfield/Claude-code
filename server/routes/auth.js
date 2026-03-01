const express = require('express');
const bcrypt = require('bcryptjs');
const { getDb } = require('../config/database');
const { generateToken, requireAuth, COOKIE_OPTIONS } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { email, password, name, company, phone, postcode, account_type } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const db = getDb();

  // Check existing
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const passwordHash = bcrypt.hashSync(password, 12);
  const validTypes = ['decorator', 'distributor', 'brand_agency', 'other'];
  const type = validTypes.includes(account_type) ? account_type : 'decorator';

  const result = db.prepare(
    'INSERT INTO users (email, password_hash, name, company, phone, postcode, account_type) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(email.toLowerCase().trim(), passwordHash, name || '', company || '', phone || '', postcode || '', type);

  const user = db.prepare('SELECT id, email, name, company, role, account_type FROM users WHERE id = ?').get(result.lastInsertRowid);
  const token = generateToken(user);

  res.cookie('auth_token', token, COOKIE_OPTIONS);
  res.status(201).json({ user });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ? AND active = 1').get(email.toLowerCase().trim());

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = generateToken(user);
  res.cookie('auth_token', token, COOKIE_OPTIONS);

  const { password_hash, ...safeUser } = user;
  res.json({ user: safeUser });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('auth_token', { path: '/' });
  res.json({ message: 'Logged out' });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  const db = getDb();
  const user = db.prepare(
    'SELECT id, email, name, company, phone, postcode, account_type, role, created_at FROM users WHERE id = ?'
  ).get(req.user.userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Get preferences
  const prefs = db.prepare('SELECT pref_key, pref_value FROM user_preferences WHERE user_id = ?').all(user.id);
  user.preferences = {};
  for (const p of prefs) {
    user.preferences[p.pref_key] = p.pref_value;
  }

  res.json({ user });
});

// PUT /api/auth/profile
router.put('/profile', requireAuth, (req, res) => {
  const { name, company, phone, postcode, account_type, preferences } = req.body;
  const db = getDb();

  db.prepare(
    'UPDATE users SET name = ?, company = ?, phone = ?, postcode = ?, account_type = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).run(
    name || '', company || '', phone || '', postcode || '',
    account_type || 'decorator',
    req.user.userId
  );

  // Update preferences
  if (preferences && typeof preferences === 'object') {
    const upsert = db.prepare(
      'INSERT INTO user_preferences (user_id, pref_key, pref_value) VALUES (?, ?, ?) ON CONFLICT(user_id, pref_key) DO UPDATE SET pref_value = excluded.pref_value'
    );
    const tx = db.transaction(() => {
      for (const [key, value] of Object.entries(preferences)) {
        upsert.run(req.user.userId, key, String(value));
      }
    });
    tx();
  }

  res.json({ message: 'Profile updated' });
});

module.exports = router;
