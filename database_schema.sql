-- Database Schema für Webklar App
-- Führe diese SQL-Befehle in deinem Supabase SQL Editor aus

-- Kunden-Projekte Tabelle erstellen
CREATE TABLE IF NOT EXISTS kunden_projekte (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  berater TEXT,
  firma TEXT,
  ansprechpartn TEXT,
  telefon TEXT,
  email TEXT,
  beschreibung TEXT,
  zielgruppe TEXT,
  website_vorha BOOLEAN DEFAULT false,
  was_gefaellt_c TEXT,
  ziel_der_websi TEXT,
  seiten_geplant TEXT,
  texte_bilder_v BOOLEAN DEFAULT false,
  fokus_inhalte TEXT,
  logo_farben_v BOOLEAN DEFAULT false,
  stilvorbilder TEXT,
  design_wunsch TEXT,
  features_gewu TEXT,
  drittanbieter TEXT,
  selbst_pflegen BOOLEAN DEFAULT false,
  laufende_betre BOOLEAN DEFAULT false,
  deadline TEXT,
  projekt_verant TEXT,
  budget TEXT,
  kommunikation TEXT,
  feedback_gesc TEXT,
  beispiellinks TEXT,
  benoetigte_fur TEXT,
  webseiten_ziel TEXT,
  geplante_seite TEXT,
  termin_datum TIMESTAMP WITH TIME ZONE,
  erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  appointment_status TEXT DEFAULT 'pending' CHECK (appointment_status IN ('pending', 'running', 'completed')),
  started_by TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Row Level Security aktivieren
ALTER TABLE kunden_projekte ENABLE ROW LEVEL SECURITY;

-- Policy für öffentlichen Zugriff (für Demo-Zwecke)
CREATE POLICY "Allow public access" ON kunden_projekte
  FOR ALL USING (true);

-- Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_kunden_projekte_termin_datum ON kunden_projekte(termin_datum);
CREATE INDEX IF NOT EXISTS idx_kunden_projekte_appointment_status ON kunden_projekte(appointment_status);
CREATE INDEX IF NOT EXISTS idx_kunden_projekte_email ON kunden_projekte(email);

-- Beispieldaten (optional)
INSERT INTO kunden_projekte (
  firma, 
  ansprechpartn, 
  email, 
  telefon, 
  beschreibung, 
  termin_datum,
  appointment_status
) VALUES 
(
  'Musterfirma GmbH',
  'Max Mustermann',
  'max@musterfirma.de',
  '+49 123 456789',
  'Neue Website für unser Unternehmen mit modernem Design und E-Commerce Funktionen.',
  NOW() + INTERVAL '7 days',
  'pending'
),
(
  'Design Studio',
  'Anna Schmidt',
  'anna@designstudio.com',
  '+49 987 654321',
  'Portfolio-Website mit Galerie und Kontaktformular.',
  NOW() + INTERVAL '14 days',
  'running'
);

-- Kommentare für bessere Dokumentation
COMMENT ON TABLE kunden_projekte IS 'Kundenprojekte und Terminbuchungen für Webklar App';
COMMENT ON COLUMN kunden_projekte.appointment_status IS 'Status des Termins: pending, running, completed';
COMMENT ON COLUMN kunden_projekte.termin_datum IS 'Geplantes Termindatum'; 