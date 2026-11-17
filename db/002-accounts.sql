ALTER TABLE admins RENAME TO accounts;
ALTER TABLE accounts
  ADD COLUMN role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'customer')),
  ADD COLUMN display_name TEXT;
ALTER TABLE accounts ALTER COLUMN role DROP DEFAULT;

ALTER TABLE sessions RENAME COLUMN admin_email TO account_email;
ALTER INDEX sessions_admin RENAME TO sessions_account;
