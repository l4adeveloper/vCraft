ALTER TABLE accounts ADD COLUMN artisan_status TEXT;
UPDATE accounts SET artisan_status = 'pending' WHERE role = 'artisan';
ALTER TABLE accounts ADD CONSTRAINT accounts_artisan_status_check CHECK (
  (role = 'artisan' AND artisan_status IS NOT NULL AND artisan_status IN ('pending', 'approved', 'rejected'))
  OR (role <> 'artisan' AND artisan_status IS NULL)
);

CREATE TABLE community_notices (
  id UUID PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('materials', 'outage', 'policy')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  version INTEGER NOT NULL DEFAULT 0 CHECK (version >= 0)
);
CREATE INDEX community_notices_published ON community_notices (published_at DESC, id)
  WHERE published_at IS NOT NULL;
