const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'beechfield.db');
const SCHEMA_PATH = path.join(__dirname, '..', 'schema.sql');
const DISTRIBUTORS_PATH = path.join(__dirname, '..', 'data', 'distributors.json');
const STOCK_PATH = path.join(__dirname, '..', 'data', 'stock.json');

let db;

function getDb() {
  if (db) return db;

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Run schema
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  db.exec(schema);

  // Seed distributors if empty
  const distCount = db.prepare('SELECT COUNT(*) as count FROM distributors').get();
  if (distCount.count === 0) {
    seedDistributors();
  }

  // Seed stock if empty
  const stockCount = db.prepare('SELECT COUNT(*) as count FROM stock').get();
  if (stockCount.count === 0) {
    seedStock();
  }

  return db;
}

function seedDistributors() {
  if (!fs.existsSync(DISTRIBUTORS_PATH)) return;
  const distributors = JSON.parse(fs.readFileSync(DISTRIBUTORS_PATH, 'utf8'));
  const insert = db.prepare(
    'INSERT OR IGNORE INTO distributors (name, slug, website_url, contact_email, phone, region, active) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  const tx = db.transaction(() => {
    for (const d of distributors) {
      insert.run(d.name, d.slug, d.website_url, d.contact_email, d.phone, d.region, d.active ? 1 : 0);
    }
  });
  tx();
  console.log(`Seeded ${distributors.length} distributors`);
}

function seedStock() {
  if (!fs.existsSync(STOCK_PATH)) return;
  const stockData = JSON.parse(fs.readFileSync(STOCK_PATH, 'utf8'));

  // Build distributor slug → id lookup
  const distRows = db.prepare('SELECT id, slug FROM distributors').all();
  const distMap = {};
  for (const r of distRows) distMap[r.slug] = r.id;

  const insertStock = db.prepare(
    'INSERT INTO stock (product_sku, colour, distributor_id, quantity) VALUES (?, ?, ?, ?)'
  );
  const insertCentral = db.prepare(
    'INSERT INTO central_stock (product_sku, colour, quantity) VALUES (?, ?, ?)'
  );

  let stockRows = 0;
  let centralRows = 0;

  const tx = db.transaction(() => {
    for (const [sku, data] of Object.entries(stockData)) {
      for (const [colour, stock] of Object.entries(data.colours)) {
        // Central stock
        insertCentral.run(sku, colour, stock.central);
        centralRows++;

        // Distributor stock
        for (const [distSlug, qty] of Object.entries(stock.distributors)) {
          const distId = distMap[distSlug];
          if (distId) {
            insertStock.run(sku, colour, distId, qty);
            stockRows++;
          }
        }
      }
    }
  });
  tx();
  console.log(`Seeded ${centralRows} central stock rows, ${stockRows} distributor stock rows`);
}

function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = { getDb, closeDb };
