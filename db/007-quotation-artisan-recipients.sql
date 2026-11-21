DO $migration$
BEGIN
  -- An earlier version of migration 006 addressed invitations to workshops.
  -- Keep those UUIDs so existing offers and accepted invitations remain linked.
  IF EXISTS (
    SELECT 1 FROM pg_attribute
    WHERE attrelid = 'quote_invitations'::regclass
      AND attname = 'workshop_id' AND NOT attisdropped
  ) THEN
    ALTER TABLE quote_invitations ADD COLUMN artisan_email TEXT;

    UPDATE quote_invitations AS invitation
    SET artisan_email = workshop.account_email
    FROM artisan_workshops AS workshop
    WHERE workshop.id = invitation.workshop_id;

    ALTER TABLE quote_invitations
      ALTER COLUMN artisan_email SET NOT NULL,
      ADD FOREIGN KEY (artisan_email) REFERENCES accounts(email) ON DELETE CASCADE,
      ADD UNIQUE (quote_id, artisan_email),
      DROP CONSTRAINT quote_invitations_workshop_id_fkey;

    ALTER TABLE quote_invitations RENAME COLUMN workshop_id TO id;
    ALTER TABLE quote_invitations RENAME COLUMN workshop_name TO artisan_name;
    ALTER TABLE quotes RENAME COLUMN accepted_workshop_id TO accepted_invitation_id;

    DROP INDEX IF EXISTS quote_invitations_workshop;
    CREATE INDEX quote_invitations_artisan ON quote_invitations (artisan_email, quote_id);
  END IF;
END;
$migration$;
