CREATE TABLE IF NOT EXISTS admins (
  email TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  admin_email TEXT NOT NULL REFERENCES admins(email) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS sessions_admin ON sessions(admin_email);

CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  request JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in-progress', 'completed')),
  allocations JSONB NOT NULL DEFAULT '[]'::jsonb,
  version INTEGER NOT NULL DEFAULT 0 CHECK (version >= 0)
);

CREATE INDEX IF NOT EXISTS quotes_created ON quotes(created_at DESC, id DESC);
