const express = require('express');
const path = require('path');
const fs = require('fs');
const { getDb } = require('../config/database');
const { requireAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// --- Products (from JSON, not DB) ---
const PRODUCTS_PATH = path.join(__dirname, '..', 'data', 'products.json');
let productsCache = null;

function getProducts() {
  if (!productsCache) {
    productsCache = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));
  }
  return productsCache;
}

// GET /api/products — list with filters
router.get('/products', (req, res) => {
  let products = getProducts();
  const { type, collection, silo, eco, search, purpose, decoration, panel, profile, limit, offset } = req.query;

  if (type) products = products.filter(p => p.type === type || p.productType?.toLowerCase() === type.toLowerCase());
  if (collection) products = products.filter(p => p.collection?.toLowerCase() === collection.toLowerCase());
  if (silo) products = products.filter(p => p.silo?.toLowerCase() === silo.toLowerCase() || p.silo2?.toLowerCase() === silo.toLowerCase());
  if (eco) products = products.filter(p => p.ecoCredentials && p.ecoCredentials.toLowerCase().includes(eco.toLowerCase()));
  if (purpose) products = products.filter(p => p.typePurpose?.toLowerCase().includes(purpose.toLowerCase()));
  if (decoration) products = products.filter(p => p.decoration?.toLowerCase().includes(decoration.toLowerCase()));
  if (panel) products = products.filter(p => p.panelClass?.toLowerCase().includes(panel.toLowerCase()) || p.panelDesign?.toLowerCase().includes(panel.toLowerCase()));
  if (profile) products = products.filter(p => p.profileClass?.toLowerCase() === profile.toLowerCase() || p.crownProfileDetail?.toLowerCase().includes(profile.toLowerCase()));

  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (p.collection || '').toLowerCase().includes(q) ||
      (p.fabric || '').toLowerCase().includes(q) ||
      (p.style || '').toLowerCase().includes(q)
    );
  }

  const total = products.length;
  const l = parseInt(limit) || 50;
  const o = parseInt(offset) || 0;
  products = products.slice(o, o + l);

  res.json({ products, total, limit: l, offset: o });
});

// GET /api/products/:sku
router.get('/products/:sku', (req, res) => {
  const products = getProducts();
  const product = products.find(p => p.sku.toUpperCase() === req.params.sku.toUpperCase());
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ product });
});

// --- Saved Lists (require auth) ---

// GET /api/lists
router.get('/lists', requireAuth, (req, res) => {
  const db = getDb();
  const lists = db.prepare(
    'SELECT id, name, brand, created_at FROM saved_lists WHERE user_id = ? ORDER BY created_at DESC'
  ).all(req.user.userId);

  // Get item counts
  for (const list of lists) {
    const count = db.prepare('SELECT COUNT(*) as count FROM saved_list_items WHERE list_id = ?').get(list.id);
    list.itemCount = count.count;
  }

  res.json({ lists });
});

// POST /api/lists
router.post('/lists', requireAuth, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'List name is required' });

  const db = getDb();
  const result = db.prepare('INSERT INTO saved_lists (user_id, name) VALUES (?, ?)').run(req.user.userId, name);
  const list = db.prepare('SELECT * FROM saved_lists WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ list });
});

// DELETE /api/lists/:id
router.delete('/lists/:id', requireAuth, (req, res) => {
  const db = getDb();
  const list = db.prepare('SELECT * FROM saved_lists WHERE id = ? AND user_id = ?').get(req.params.id, req.user.userId);
  if (!list) return res.status(404).json({ error: 'List not found' });

  db.prepare('DELETE FROM saved_lists WHERE id = ?').run(req.params.id);
  res.json({ message: 'List deleted' });
});

// GET /api/lists/:id/items
router.get('/lists/:id/items', requireAuth, (req, res) => {
  const db = getDb();
  const list = db.prepare('SELECT * FROM saved_lists WHERE id = ? AND user_id = ?').get(req.params.id, req.user.userId);
  if (!list) return res.status(404).json({ error: 'List not found' });

  const items = db.prepare('SELECT * FROM saved_list_items WHERE list_id = ? ORDER BY added_at DESC').all(req.params.id);

  // Enrich with product data
  const products = getProducts();
  const productMap = {};
  for (const p of products) productMap[p.sku.toUpperCase()] = p;

  for (const item of items) {
    item.product = productMap[item.product_sku.toUpperCase()] || null;
  }

  res.json({ list, items });
});

// POST /api/lists/:id/items
router.post('/lists/:id/items', requireAuth, (req, res) => {
  const { product_sku, colour, quantity, notes } = req.body;
  if (!product_sku) return res.status(400).json({ error: 'Product SKU is required' });

  const db = getDb();
  const list = db.prepare('SELECT * FROM saved_lists WHERE id = ? AND user_id = ?').get(req.params.id, req.user.userId);
  if (!list) return res.status(404).json({ error: 'List not found' });

  const result = db.prepare(
    'INSERT INTO saved_list_items (list_id, product_sku, colour, quantity, notes) VALUES (?, ?, ?, ?, ?)'
  ).run(req.params.id, product_sku.toUpperCase(), colour || '', quantity || 1, notes || '');

  const item = db.prepare('SELECT * FROM saved_list_items WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ item });
});

// PUT /api/lists/:listId/items/:itemId
router.put('/lists/:listId/items/:itemId', requireAuth, (req, res) => {
  const { quantity, notes, colour } = req.body;
  const db = getDb();

  const list = db.prepare('SELECT * FROM saved_lists WHERE id = ? AND user_id = ?').get(req.params.listId, req.user.userId);
  if (!list) return res.status(404).json({ error: 'List not found' });

  const item = db.prepare('SELECT * FROM saved_list_items WHERE id = ? AND list_id = ?').get(req.params.itemId, req.params.listId);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  db.prepare('UPDATE saved_list_items SET quantity = ?, notes = ?, colour = ? WHERE id = ?')
    .run(quantity ?? item.quantity, notes ?? item.notes, colour ?? item.colour, req.params.itemId);

  res.json({ message: 'Item updated' });
});

// DELETE /api/lists/:listId/items/:itemId
router.delete('/lists/:listId/items/:itemId', requireAuth, (req, res) => {
  const db = getDb();
  const list = db.prepare('SELECT * FROM saved_lists WHERE id = ? AND user_id = ?').get(req.params.listId, req.user.userId);
  if (!list) return res.status(404).json({ error: 'List not found' });

  db.prepare('DELETE FROM saved_list_items WHERE id = ? AND list_id = ?').run(req.params.itemId, req.params.listId);
  res.json({ message: 'Item removed' });
});

// GET /api/lists/:id/export — CSV export
router.get('/lists/:id/export', requireAuth, (req, res) => {
  const db = getDb();
  const list = db.prepare('SELECT * FROM saved_lists WHERE id = ? AND user_id = ?').get(req.params.id, req.user.userId);
  if (!list) return res.status(404).json({ error: 'List not found' });

  const items = db.prepare('SELECT * FROM saved_list_items WHERE list_id = ?').all(req.params.id);
  const products = getProducts();
  const productMap = {};
  for (const p of products) productMap[p.sku.toUpperCase()] = p;

  const csvRows = ['SKU,Product Name,Colour,Quantity,Notes'];
  for (const item of items) {
    const p = productMap[item.product_sku.toUpperCase()];
    const name = p ? p.name.replace(/,/g, '') : '';
    csvRows.push(`${item.product_sku},"${name}",${item.colour || ''},${item.quantity},"${(item.notes || '').replace(/"/g, '""')}"`);
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${list.name.replace(/[^a-z0-9]/gi, '-')}-export.csv"`);
  res.send(csvRows.join('\n'));
});

// --- Leads / RFQ ---

// POST /api/leads
router.post('/leads', optionalAuth, (req, res) => {
  const { name, email, company, phone, postcode, type, message, product_skus } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

  const db = getDb();
  const skus = Array.isArray(product_skus) ? product_skus.join(',') : (product_skus || '');
  const leadType = ['rfq', 'contact', 'restock_notify', 'multi_rfq'].includes(type) ? type : 'rfq';

  const result = db.prepare(
    'INSERT INTO leads (name, email, company, phone, postcode, type, message, product_skus) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(name, email, company || '', phone || '', postcode || '', leadType, message || '', skus);

  res.status(201).json({ lead: { id: result.lastInsertRowid }, message: 'Enquiry submitted' });
});

module.exports = router;
