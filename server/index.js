const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { getDb, closeDb } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialise database on startup
getDb();

// --- API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));
app.use('/api/stock', require('./routes/stock'));
app.use('/api/products', require('./routes/assets'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/crm', require('./routes/crm'));

// Distributor listing (public)
app.get('/api/distributors', (req, res) => {
  const db = getDb();
  const distributors = db.prepare('SELECT id, name, slug, website_url, region FROM distributors WHERE active = 1 ORDER BY name').all();
  res.json({ distributors });
});

// --- Static File Serving ---
// Serve admin portal
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

// Serve brand sites
app.use('/sites', express.static(path.join(__dirname, '..', 'sites')));

// Serve Beechfield site at root
app.use('/', express.static(path.join(__dirname, '..', 'sites', 'beechfield'), { extensions: ['html'] }));

// Serve shared assets
app.use('/shared', express.static(path.join(__dirname, '..', 'sites', 'shared')));

// Fallback: serve beechfield index for SPA-like navigation
app.get('*', (req, res, next) => {
  // Don't intercept API calls or file requests
  if (req.path.startsWith('/api/') || req.path.includes('.')) {
    return next();
  }

  // Try to serve the HTML file matching the path
  const htmlPath = path.join(__dirname, '..', 'sites', 'beechfield', req.path + '.html');
  const indexPath = path.join(__dirname, '..', 'sites', 'beechfield', req.path, 'index.html');
  const fs = require('fs');

  if (fs.existsSync(htmlPath)) {
    return res.sendFile(htmlPath);
  }
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  // 404
  res.status(404).sendFile(path.join(__dirname, '..', 'sites', 'beechfield', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Beechfield site running at http://localhost:${PORT}`);
  console.log(`Admin portal at http://localhost:${PORT}/admin`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  closeDb();
  process.exit(0);
});
process.on('SIGTERM', () => {
  closeDb();
  process.exit(0);
});

module.exports = app;
