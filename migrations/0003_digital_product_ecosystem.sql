-- ============================================================
-- Zynovexa Digital Product Ecosystem
-- Products, storefronts, orders, secure delivery, analytics
-- ============================================================

CREATE TABLE IF NOT EXISTS creator_storefronts (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  headline TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  accent_color TEXT DEFAULT '#3b6cf5',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS digital_products (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  storefront_id TEXT DEFAULT '',
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  price INTEGER NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'usd',
  delivery_type TEXT DEFAULT 'file',
  thumbnail_url TEXT DEFAULT '',
  delivery_link TEXT DEFAULT '',
  is_published INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (storefront_id) REFERENCES creator_storefronts(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS product_assets (
  id TEXT PRIMARY KEY,
  product_id TEXT UNIQUE NOT NULL,
  file_name TEXT DEFAULT '',
  mime_type TEXT DEFAULT 'application/octet-stream',
  file_size INTEGER DEFAULT 0,
  file_data_base64 TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (product_id) REFERENCES digital_products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS commerce_orders (
  id TEXT PRIMARY KEY,
  seller_user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  buyer_name TEXT DEFAULT '',
  buyer_email TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  platform_fee_percent REAL DEFAULT 0,
  platform_fee_amount INTEGER DEFAULT 0,
  seller_net_amount INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'usd',
  payment_provider TEXT DEFAULT 'stripe',
  external_order_id TEXT DEFAULT '',
  external_payment_id TEXT DEFAULT '',
  payment_status TEXT DEFAULT 'pending',
  delivery_status TEXT DEFAULT 'pending',
  source_platform TEXT DEFAULT '',
  source_post_id TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  paid_at TEXT DEFAULT '',
  delivered_at TEXT DEFAULT '',
  FOREIGN KEY (seller_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES digital_products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_download_tokens (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  max_downloads INTEGER DEFAULT 3,
  download_count INTEGER DEFAULT 0,
  last_downloaded_at TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (order_id) REFERENCES commerce_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES digital_products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_events (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  seller_user_id TEXT NOT NULL,
  order_id TEXT DEFAULT '',
  event_type TEXT NOT NULL,
  session_id TEXT DEFAULT '',
  source_platform TEXT DEFAULT '',
  source_post_id TEXT DEFAULT '',
  visitor_email TEXT DEFAULT '',
  metadata TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (product_id) REFERENCES digital_products(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS post_product_links (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  cta_text TEXT DEFAULT 'Buy here',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES digital_products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS email_jobs (
  id TEXT PRIMARY KEY,
  user_id TEXT DEFAULT '',
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_body TEXT DEFAULT '',
  status TEXT DEFAULT 'queued',
  created_at TEXT DEFAULT (datetime('now')),
  sent_at TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS rate_limit_buckets (
  id TEXT PRIMARY KEY,
  scope TEXT NOT NULL,
  identifier TEXT NOT NULL,
  window_start TEXT NOT NULL,
  hits INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_storefront_username ON creator_storefronts(username);
CREATE INDEX IF NOT EXISTS idx_products_user ON digital_products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_storefront ON digital_products(storefront_id);
CREATE INDEX IF NOT EXISTS idx_orders_product ON commerce_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON commerce_orders(seller_user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON commerce_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_downloads_order ON product_download_tokens(order_id);
CREATE INDEX IF NOT EXISTS idx_downloads_hash ON product_download_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_product_events_product ON product_events(product_id);
CREATE INDEX IF NOT EXISTS idx_product_events_type ON product_events(event_type);
CREATE INDEX IF NOT EXISTS idx_post_product_links_post ON post_product_links(post_id);
CREATE INDEX IF NOT EXISTS idx_rate_limit_lookup ON rate_limit_buckets(scope, identifier, window_start);