# Supabase Setup für Terminbuchung

## 1. Datenbank-Spalte hinzufügen

Führe folgendes SQL in der Supabase SQL Editor aus:

```sql
-- Add termin_datum column to kunden_projekte table
ALTER TABLE kunden_projekte 
ADD COLUMN termin_datum timestamp;

-- Add comment for clarity
COMMENT ON COLUMN kunden_projekte.termin_datum IS 'Beratungstermin - wann ist das Gespräch geplant';

-- Optional: Add index for better query performance when checking availability
CREATE INDEX idx_termin_datum ON kunden_projekte(termin_datum);
```

## 2. Supabase Auth konfigurieren

### 2.1 Authentication Settings
1. Gehe zu **Authentication > Settings** in deinem Supabase Dashboard
2. Aktiviere **Email Auth** unter **Auth Providers**
3. Konfiguriere **Site URL**: `http://localhost:3000` (für Entwicklung)
4. Setze **Redirect URLs**: `http://localhost:3000/verify-email`

### 2.2 Email Templates anpassen (optional)
1. Gehe zu **Authentication > Email Templates**
2. Passe die **Magic Link** E-Mail an:

**Subject:**
```
Bestätigen Sie Ihren Termin bei Webklar
```

**Body:**
```html
<h2>Terminbestätigung bei Webklar</h2>
<p>Vielen Dank für Ihre Terminanfrage!</p>
<p>Bitte klicken Sie auf den folgenden Link, um Ihre E-Mail-Adresse zu bestätigen und Ihren Termin zu bestätigen:</p>
<p><a href="{{ .ConfirmationURL }}">Termin bestätigen</a></p>
<p>Falls der Link nicht funktioniert, kopieren Sie diese URL in Ihren Browser:</p>
<p>{{ .ConfirmationURL }}</p>
<p>Mit freundlichen Grüßen,<br>Ihr Webklar Team</p>
```

## 3. Row Level Security (RLS) konfigurieren

### 3.1 RLS aktivieren
```sql
-- Enable RLS on kunden_projekte table
ALTER TABLE kunden_projekte ENABLE ROW LEVEL SECURITY;
```

### 3.2 Policies erstellen
```sql
-- Allow authenticated users to insert appointments
CREATE POLICY "Users can insert their own appointments" ON kunden_projekte
FOR INSERT WITH CHECK (true);

-- Allow reading appointments (for availability checking)
CREATE POLICY "Anyone can read appointments" ON kunden_projekte
FOR SELECT USING (true);

-- Optional: Allow users to update their own appointments
CREATE POLICY "Users can update their own appointments" ON kunden_projekte
FOR UPDATE USING (true);
```

## 4. Environment Variables

Stelle sicher, dass deine `.env.local` Datei die Supabase-Konfiguration enthält:

```env
NEXT_PUBLIC_SUPABASE_URL=https://rndjwuupvsoxwjqozomf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZGp3dXVwdnNveHdqcW96b21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NjI0NjcsImV4cCI6MjA2ODIzODQ2N30.0SGmIpzMgPSXXEUurRdG3IJCutJSdoP1ByJaKAENw3Q
```

## 5. Testing

### 5.1 Lokaler Test
1. Starte die Entwicklungsumgebung: `npm run dev`
2. Gehe zu `http://localhost:3000`
3. Teste die Terminbuchung

### 5.2 E-Mail-Verifizierung testen
1. Verwende eine echte E-Mail-Adresse für Tests
2. Überprüfe den Spam-Ordner
3. Klicke auf den Magic Link in der E-Mail

## 6. Produktions-Deployment

### 6.1 Site URL anpassen
Ändere die Site URL in Supabase auf deine Produktions-Domain:
- **Site URL**: `https://deine-domain.com`
- **Redirect URLs**: `https://deine-domain.com/verify-email`

### 6.2 SSL/HTTPS
Stelle sicher, dass deine Domain HTTPS verwendet, da Magic Links nur über HTTPS funktionieren.

## 7. Troubleshooting

### Häufige Probleme:

1. **E-Mail kommt nicht an**
   - Überprüfe Spam-Ordner
   - Teste mit verschiedenen E-Mail-Providern
   - Überprüfe Supabase E-Mail-Logs

2. **Magic Link funktioniert nicht**
   - Überprüfe Redirect URLs in Supabase
   - Stelle sicher, dass HTTPS verwendet wird
   - Überprüfe Browser-Konsole für Fehler

3. **Termin wird nicht gespeichert**
   - Überprüfe RLS Policies
   - Überprüfe Browser-Konsole für Fehler
   - Überprüfe Supabase Logs

## 8. Sicherheitshinweise

- Magic Links sind sicherer als Passwörter
- E-Mails werden automatisch verifiziert
- Keine doppelten Termine möglich
- Automatische Verfügbarkeitsprüfung

## 9. Erweiterte Features

### 9.1 E-Mail-Benachrichtigungen
Du kannst Supabase Functions verwenden, um automatische E-Mail-Benachrichtigungen zu senden.

### 9.2 Kalender-Integration
Für erweiterte Kalender-Features kannst du Google Calendar API integrieren.

### 9.3 Admin-Dashboard
Erstelle eine Admin-Seite zum Verwalten der Termine. 