-- Beechfield Website Database Schema
-- SQLite with brand-agnostic user model (SSO-ready)

-- Users: no brand column — works across all brands via SSO
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  company TEXT,
  phone TEXT,
  postcode TEXT,
  account_type TEXT DEFAULT 'decorator' CHECK(account_type IN ('decorator', 'distributor', 'brand_agency', 'other')),
  role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin', 'website_manager', 'digital_editor', 'product_editor', 'editorial_editor', 'reviewer', 'legal_reviewer')),
  active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Marketing preferences (key-value for flexibility)
CREATE TABLE IF NOT EXISTS user_preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pref_key TEXT NOT NULL,
  pref_value TEXT NOT NULL,
  UNIQUE(user_id, pref_key)
);

-- Saved lists / projects: brand-scoped for future cross-brand
CREATE TABLE IF NOT EXISTS saved_lists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brand TEXT DEFAULT 'beechfield',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- List items: product_sku is brand-prefixed (B=Beechfield, BG=BagBase, etc.)
CREATE TABLE IF NOT EXISTS saved_list_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  list_id INTEGER NOT NULL REFERENCES saved_lists(id) ON DELETE CASCADE,
  product_sku TEXT NOT NULL,
  colour TEXT DEFAULT '',
  quantity INTEGER DEFAULT 1,
  notes TEXT,
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Leads / RFQs
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  postcode TEXT,
  type TEXT DEFAULT 'rfq' CHECK(type IN ('rfq', 'contact', 'restock_notify', 'multi_rfq')),
  message TEXT,
  product_skus TEXT,
  status TEXT DEFAULT 'new' CHECK(status IN ('new', 'contacted', 'quoted', 'converted', 'closed')),
  zoho_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sessions (for token blacklisting on logout)
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Audit log
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Distributors
CREATE TABLE IF NOT EXISTS distributors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  website_url TEXT,
  contact_email TEXT,
  phone TEXT,
  region TEXT,
  active INTEGER DEFAULT 1
);

-- Stock by product × colour × distributor (placeholder data)
CREATE TABLE IF NOT EXISTS stock (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_sku TEXT NOT NULL,
  colour TEXT NOT NULL,
  distributor_id INTEGER REFERENCES distributors(id),
  quantity INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Beechfield central stock (separate from distributor stock)
CREATE TABLE IF NOT EXISTS central_stock (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_sku TEXT NOT NULL,
  colour TEXT NOT NULL,
  quantity INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_saved_lists_user ON saved_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_list_items_list ON saved_list_items(list_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_stock_sku ON stock(product_sku);
CREATE INDEX IF NOT EXISTS idx_central_stock_sku ON central_stock(product_sku);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user ON user_preferences(user_id);
