ALTER TABLE accounts
  DROP CONSTRAINT accounts_role_check,
  ADD CONSTRAINT accounts_role_check CHECK (role IN ('admin', 'customer', 'artisan'));
