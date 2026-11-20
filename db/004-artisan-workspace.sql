CREATE TABLE artisan_workshops (
  id UUID PRIMARY KEY,
  account_email TEXT NOT NULL UNIQUE REFERENCES accounts(email) ON DELETE CASCADE,
  name TEXT NOT NULL,
  history TEXT NOT NULL,
  photo_urls TEXT[] NOT NULL DEFAULT '{}',
  certificates TEXT NOT NULL DEFAULT ''
);

CREATE TABLE artisan_products (
  id UUID PRIMARY KEY,
  workshop_id UUID NOT NULL REFERENCES artisan_workshops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price > 0),
  photo_url TEXT NOT NULL,
  journal JSONB NOT NULL CHECK (jsonb_typeof(journal) = 'array'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX artisan_products_workshop ON artisan_products(workshop_id, created_at DESC);

ALTER TABLE quotes ADD COLUMN buyer_email TEXT REFERENCES accounts(email) ON DELETE SET NULL;
CREATE INDEX quotes_buyer ON quotes(buyer_email, created_at DESC);
CREATE INDEX quotes_allocations ON quotes USING GIN (allocations jsonb_path_ops);

CREATE TABLE artisan_quote_replies (
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  workshop_id UUID NOT NULL REFERENCES artisan_workshops(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  unit_price INTEGER CHECK (unit_price > 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (quote_id, workshop_id)
);
