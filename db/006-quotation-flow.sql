ALTER TABLE quotes
  ADD COLUMN flow_state TEXT,
  ADD COLUMN accepted_invitation_id UUID,
  ADD CONSTRAINT quotes_flow_state_check CHECK (
    (flow_state IS NULL AND accepted_invitation_id IS NULL)
    OR (flow_state IS NOT NULL AND (
      (flow_state IN ('sent', 'bidding') AND accepted_invitation_id IS NULL)
      OR (flow_state IN ('accepted', 'in-production', 'delivered') AND accepted_invitation_id IS NOT NULL)
    ))
  );

CREATE TABLE quote_invitations (
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  id UUID NOT NULL,
  artisan_email TEXT NOT NULL REFERENCES accounts(email) ON DELETE CASCADE,
  artisan_name TEXT NOT NULL,
  response TEXT NOT NULL DEFAULT 'pending' CHECK (response IN ('pending', 'offered', 'declined')),
  unit_price INTEGER,
  completion_date DATE,
  hidden BOOLEAN NOT NULL DEFAULT FALSE,
  version INTEGER NOT NULL DEFAULT 0 CHECK (version >= 0),
  PRIMARY KEY (quote_id, id),
  UNIQUE (quote_id, artisan_email),
  CHECK (
    (response = 'offered' AND unit_price IS NOT NULL AND unit_price BETWEEN 1 AND 1000000000 AND completion_date IS NOT NULL)
    OR (response <> 'offered' AND unit_price IS NULL AND completion_date IS NULL)
  ),
  CHECK (NOT hidden OR response = 'declined')
);

ALTER TABLE quotes ADD CONSTRAINT quotes_accepted_invitation_fk
  FOREIGN KEY (id, accepted_invitation_id) REFERENCES quote_invitations (quote_id, id);
CREATE INDEX quote_invitations_artisan ON quote_invitations (artisan_email, quote_id);
