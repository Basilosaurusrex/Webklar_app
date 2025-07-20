# Supabase Setup Guide

## 1. Database Migration

Führe diese SQL-Befehle in deiner Supabase SQL Editor aus:

```sql
-- Add termin_datum column to kunden_projekte table
-- This column will store the consultation appointment date/time

ALTER TABLE kunden_projekte 
ADD COLUMN termin_datum timestamp;

-- Add comment for clarity
COMMENT ON COLUMN kunden_projekte.termin_datum IS 'Beratungstermin - wann ist das Gespräch geplant';

-- Optional: Add index for better query performance when checking availability
CREATE INDEX idx_termin_datum ON kunden_projekte(termin_datum);
```

## 2. Authentication Settings

### Email Auth aktivieren:
1. Gehe zu **Authentication → Settings**
2. Aktiviere **Email Auth**
3. Stelle sicher, dass **"Enable email confirmations"** aktiviert ist

### Email Templates anpassen:
1. Gehe zu **Authentication → Email Templates**
2. Wähle **"Magic Link"** Template
3. Passe den Inhalt an:

**Subject:** `Terminbestätigung - Webklar`
**Content:**
```html
<h2>Terminbestätigung</h2>
<p>Vielen Dank für Ihre Terminanfrage bei Webklar!</p>
<p>Klicken Sie auf den folgenden Link, um Ihren Termin zu bestätigen:</p>
<a href="{{ .ConfirmationURL }}">Termin bestätigen</a>
<p>Falls der Link nicht funktioniert, kopieren Sie diese URL in Ihren Browser:</p>
<p>{{ .ConfirmationURL }}</p>
<p>Mit freundlichen Grüßen,<br>Ihr Webklar Team</p>
```

## 3. Row Level Security (RLS)

Führe diese SQL-Befehle aus, um RLS-Policies zu erstellen:

```sql
-- Enable RLS on kunden_projekte table
ALTER TABLE kunden_projekte ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting appointments (public access)
CREATE POLICY "Allow public appointment insert" ON kunden_projekte
FOR INSERT WITH CHECK (true);

-- Create policy for reading appointments (optional - for admin access)
CREATE POLICY "Allow authenticated read" ON kunden_projekte
FOR SELECT USING (auth.role() = 'authenticated');
```

## 4. Environment Variables

Stelle sicher, dass deine `.env.local` Datei die Supabase-Konfiguration enthält:

```env
NEXT_PUBLIC_SUPABASE_URL=https://rndjwuupvsoxwjqozomf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZGp3dXVwdnNveHdqcW96b21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NjI0NjcsImV4cCI6MjA2ODIzODQ2N30.0SGmIpzMgPSXXEUurRdG3IJCutJSdoP1ByJaKAENw3Q
```

## 5. SMTP Configuration Fix

### Problem mit Port 465:
Deine aktuelle SMTP-Konfiguration verwendet Port 465 mit Implicit TLS, was bei Supabase manchmal Probleme verursacht.

### Lösung:
1. Gehe zu **Authentication → Settings → Email Auth**
2. Klicke auf **"Enable Custom SMTP"**
3. Ändere die Einstellungen:

**SMTP Settings:**
- **Host:** `smtp.porkbun.com`
- **Port:** `587` (statt 465)
- **Security:** `STARTTLS`
- **Username:** `support@webklar.com`
- **Password:** [dein Passwort]
- **Sender Email:** `support@webklar.com`
- **Sender Name:** `Webklar`
- **Rate Limit:** `60` Sekunden

### Alternative Ports testen:
Falls Port 587 nicht funktioniert, versuche:
- **Port:** `50587` (Alternative STARTTLS)
- **Port:** `465` (falls 587 nicht funktioniert)

## 6. Testing

### Test-Modus aktivieren:
```typescript
// In components/AppointmentBooking.tsx
const [testMode, setTestMode] = useState(true); // Für schnelles Testing
```

### E-Mail-Verifizierung testen:
1. Fülle das Termin-Formular aus
2. Klicke auf "Verifizierung senden"
3. Prüfe deine E-Mails (auch Spam-Ordner)
4. Klicke auf den Magic Link

### Rate Limit umgehen:
Falls Rate Limits auftreten:
- Warte 60 Sekunden
- Verwende "Manuelle Bestätigung" für Tests
- Aktiviere Test-Modus für direkte Speicherung

## 7. Troubleshooting

### E-Mails kommen nicht an:
1. **SMTP-Port ändern:** Versuche Port 587 statt 465
2. **Domain-Verifizierung:** Prüfe DNS-Einstellungen
3. **Spam-Ordner:** Prüfe auch Spam/Junk-Ordner
4. **Rate Limits:** Warte 60 Sekunden zwischen Versuchen

### Rate Limit Fehler:
- Warte 60 Sekunden
- Verwende manuelle Bestätigung
- Aktiviere Test-Modus

### Datenbank-Fehler:
- Führe die Migration aus
- Prüfe RLS-Policies
- Teste mit "Datenbank-Verbindung testen" Button 