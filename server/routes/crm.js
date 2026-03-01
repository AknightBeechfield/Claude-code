const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roles');
const { getDb } = require('../config/database');
const zoho = require('../utils/zoho');

const router = express.Router();

// All CRM routes require admin
router.use(requireAuth);
router.use(requireAdmin);

// GET /api/crm/status
router.get('/status', async (req, res) => {
  const status = await zoho.getConnectionStatus();
  res.json(status);
});

// POST /api/crm/push-lead/:id — push a lead to Zoho
router.post('/push-lead/:id', async (req, res) => {
  const db = getDb();
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });

  const result = await zoho.pushLead({
    name: lead.name,
    email: lead.email,
    company: lead.company,
    phone: lead.phone,
    message: lead.message,
    product_skus: lead.product_skus,
    type: lead.type,
  });

  if (result.success) {
    db.prepare('UPDATE leads SET zoho_id = ? WHERE id = ?').run(result.zohoId, req.params.id);
  }

  res.json(result);
});

module.exports = router;
