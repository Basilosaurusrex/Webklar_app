-- Add termin_datum column to kunden_projekte table
-- This column will store the consultation appointment date/time

ALTER TABLE kunden_projekte 
ADD COLUMN termin_datum timestamp;

-- Add comment for clarity
COMMENT ON COLUMN kunden_projekte.termin_datum IS 'Beratungstermin - wann ist das Gespräch geplant';

-- Optional: Add index for better query performance when checking availability
CREATE INDEX idx_termin_datum ON kunden_projekte(termin_datum); 