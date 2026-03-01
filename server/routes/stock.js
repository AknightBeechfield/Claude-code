const express = require('express');
const { getDb } = require('../config/database');

const router = express.Router();

// GET /api/stock/:sku — stock by colour across all distributors + central
router.get('/:sku', (req, res) => {
  const sku = req.params.sku.toUpperCase();
  const db = getDb();

  // Central stock
  const central = db.prepare(
    'SELECT colour, quantity FROM central_stock WHERE product_sku = ?'
  ).all(sku);

  // Distributor stock with distributor names
  const distStock = db.prepare(`
    SELECT s.colour, s.quantity, d.name as distributor_name, d.slug as distributor_slug, d.website_url
    FROM stock s
    JOIN distributors d ON s.distributor_id = d.id
    WHERE s.product_sku = ? AND d.active = 1
    ORDER BY s.colour, d.name
  `).all(sku);

  // Build structured response
  const colourMap = {};

  for (const row of central) {
    if (!colourMap[row.colour]) {
      colourMap[row.colour] = { central: 0, distributors: {}, total: 0 };
    }
    colourMap[row.colour].central = row.quantity;
    colourMap[row.colour].total += row.quantity;
  }

  for (const row of distStock) {
    if (!colourMap[row.colour]) {
      colourMap[row.colour] = { central: 0, distributors: {}, total: 0 };
    }
    colourMap[row.colour].distributors[row.distributor_slug] = {
      name: row.distributor_name,
      quantity: row.quantity,
      url: row.website_url,
    };
    colourMap[row.colour].total += row.quantity;
  }

  res.json({ sku, colours: colourMap });
});

// GET /api/distributors
router.get('/', (req, res) => {
  // This is mounted at /api/distributors in index.js
  const db = getDb();
  const distributors = db.prepare('SELECT * FROM distributors WHERE active = 1 ORDER BY name').all();
  res.json({ distributors });
});

module.exports = router;
