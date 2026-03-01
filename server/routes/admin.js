const express = require('express');
const { getDb } = require('../config/database');
const { requireAuth } = require('../middleware/auth');
const { requireAdmin, requireRole } = require('../middleware/roles');

const router = express.Router();

// All admin routes require auth + admin role
router.use(requireAuth);
router.use(requireRole('admin', 'website_manager'));

// GET /api/admin/stats
router.get('/stats', (req, res) => {
  const db = getDb();
  const users = db.prepare('SELECT COUNT(*) as count FROM users').get();
  const leads = db.prepare('SELECT COUNT(*) as count FROM leads').get();
  const newLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'new'").get();
  const lists = db.prepare('SELECT COUNT(*) as count FROM saved_lists').get();
  const distributors = db.prepare('SELECT COUNT(*) as count FROM distributors WHERE active = 1').get();

  res.json({
    users: users.count,
    leads: leads.count,
    newLeads: newLeads.count,
    savedLists: lists.count,
    distributors: distributors.count,
  });
});

// --- Users ---
router.get('/users', (req, res) => {
  const db = getDb();
  const { limit, offset, search } = req.query;
  const l = parseInt(limit) || 50;
  const o = parseInt(offset) || 0;

  let query = 'SELECT id, email, name, company, account_type, role, active, created_at FROM users';
  const params = [];
  if (search) {
    query += ' WHERE email LIKE ? OR name LIKE ? OR company LIKE ?';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(l, o);

  const users = db.prepare(query).all(...params);
  const total = db.prepare('SELECT COUNT(*) as count FROM users').get();
  res.json({ users, total: total.count });
});

router.put('/users/:id', requireAdmin, (req, res) => {
  const { role, active } = req.body;
  const db = getDb();
  if (role) db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);
  if (active !== undefined) db.prepare('UPDATE users SET active = ? WHERE id = ?').run(active ? 1 : 0, req.params.id);
  res.json({ message: 'User updated' });
});

// --- Leads ---
router.get('/leads', (req, res) => {
  const db = getDb();
  const { status, limit, offset } = req.query;
  const l = parseInt(limit) || 50;
  const o = parseInt(offset) || 0;

  let query = 'SELECT * FROM leads';
  const params = [];
  if (status) {
    query += ' WHERE status = ?';
    params.push(status);
  }
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(l, o);

  const leads = db.prepare(query).all(...params);
  const total = db.prepare('SELECT COUNT(*) as count FROM leads').get();
  res.json({ leads, total: total.count });
});

router.patch('/leads/:id', (req, res) => {
  const { status } = req.body;
  const db = getDb();
  db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ message: 'Lead updated' });
});

// --- Distributors ---
router.get('/distributors', (req, res) => {
  const db = getDb();
  const distributors = db.prepare('SELECT * FROM distributors ORDER BY name').all();
  res.json({ distributors });
});

router.post('/distributors', requireAdmin, (req, res) => {
  const { name, slug, website_url, contact_email, phone, region } = req.body;
  if (!name || !slug) return res.status(400).json({ error: 'Name and slug required' });

  const db = getDb();
  const result = db.prepare(
    'INSERT INTO distributors (name, slug, website_url, contact_email, phone, region) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(name, slug, website_url || '', contact_email || '', phone || '', region || '');
  res.status(201).json({ id: result.lastInsertRowid });
});

router.put('/distributors/:id', requireAdmin, (req, res) => {
  const { name, website_url, contact_email, phone, region, active } = req.body;
  const db = getDb();
  db.prepare(
    'UPDATE distributors SET name = ?, website_url = ?, contact_email = ?, phone = ?, region = ?, active = ? WHERE id = ?'
  ).run(name, website_url, contact_email, phone, region, active ? 1 : 0, req.params.id);
  res.json({ message: 'Distributor updated' });
});

// --- Audit Log ---
router.get('/audit', requireAdmin, (req, res) => {
  const db = getDb();
  const logs = db.prepare(
    'SELECT a.*, u.email as user_email FROM audit_log a LEFT JOIN users u ON a.user_id = u.id ORDER BY a.created_at DESC LIMIT 100'
  ).all();
  res.json({ logs });
});

module.exports = router;
