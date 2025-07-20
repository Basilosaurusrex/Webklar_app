# Installation Guide - Supabase Authentication

## 1. Dependencies installieren

Führe diese Befehle in deinem Projekt aus:

```bash
# Supabase Client
npm install @supabase/supabase-js

# Supabase Auth Helpers für Next.js
npm install @supabase/auth-helpers-nextjs

# Optional: TypeScript Types (falls noch nicht installiert)
npm install @types/node
```

## 2. Environment Variables einrichten

Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# E-Mail Provider (Resend oder Mailgun)
RESEND_API_KEY=your_resend_api_key
# ODER
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=webclar.com
```

## 3. Supabase Client konfigurieren

Erstelle die Datei `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
```

## 4. Supabase Dashboard konfigurieren

### 4.1 Authentication Settings

1. Gehe zu deinem Supabase Dashboard
2. Klicke auf "Authentication" → "Settings" → "General"
3. Aktiviere:
   - ✅ Enable magic links
   - ✅ Enable email confirmations

### 4.2 Site URL konfigurieren

```
Site URL: https://deine-domain.com
Redirect URLs: 
- https://deine-domain.com/auth/callback
- http://localhost:3000/auth/callback
```

### 4.3 E-Mail Templates anpassen

1. Gehe zu "Authentication" → "Templates"
2. Bearbeite das "Magic Link" Template:

```html
<h2>Willkommen bei Webklar!</h2>
<p>Klicke auf den Link unten, um deine E-Mail-Adresse zu bestätigen:</p>
<a href="{{ .ConfirmationURL }}">E-Mail bestätigen</a>
<p>Oder kopiere diesen Link in deinen Browser:</p>
<p>{{ .ConfirmationURL }}</p>
<p>Dieser Link ist 24 Stunden gültig.</p>
```

## 5. E-Mail-Provider einrichten

### Option A: Resend (Empfohlen)

1. Gehe zu https://resend.com
2. Erstelle einen kostenlosen Account
3. Füge deine Domain `webclar.com` hinzu
4. Generiere einen API Key
5. Konfiguriere SMTP in Supabase:

```
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP Username: resend
SMTP Password: [dein_resend_api_key]
From Email: support@webclar.com
```

### Option B: Mailgun

1. Gehe zu https://mailgun.com
2. Erstelle einen kostenlosen Account
3. Füge deine Domain hinzu
4. Generiere einen API Key
5. Konfiguriere SMTP in Supabase:

```
SMTP Host: smtp.mailgun.org
SMTP Port: 587
SMTP Username: [dein_mailgun_username]
SMTP Password: [dein_mailgun_password]
From Email: support@webclar.com
```

## 6. DNS-Einträge in Porkbun

### Für Resend:

```
Type: CNAME
Name: email
Value: track.resend.com
TTL: 3600

Type: TXT
Name: @
Value: resend-verification=abc123def456
TTL: 3600

Type: MX
Name: @
Value: mxa.resend.com
Priority: 10
TTL: 3600

Type: MX
Name: @
Value: mxb.resend.com
Priority: 20
TTL: 3600
```

### Für Mailgun:

```
Type: TXT
Name: @
Value: v=spf1 include:mailgun.org ~all
TTL: 3600

Type: CNAME
Name: email
Value: mxa.mailgun.org
TTL: 3600

Type: CNAME
Name: mxa
Value: mxa.mailgun.org
TTL: 3600

Type: CNAME
Name: mxb
Value: mxb.mailgun.org
TTL: 3600
```

## 7. Integration in deine App

### 7.1 Hauptseite anpassen

Ersetze in deiner `app/page.tsx`:

```typescript
import ProtectedAppointmentBooking from '@/components/ProtectedAppointmentBooking'

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <ProtectedAppointmentBooking />
    </main>
  )
}
```

### 7.2 AppointmentBooking anpassen

Füge in deiner `components/AppointmentBooking.tsx` die Authentifizierungsprüfung hinzu:

```typescript
import { useAuth } from '@/hooks/useAuth'

export default function AppointmentBooking() {
  const { user } = useAuth()
  
  const handleFormSubmit = async (data: AppointmentData) => {
    // Prüfe Authentifizierung
    if (!user) {
      setError('Bitte melde dich zuerst an.')
      return
    }

    // Bestehende Logik...
  }

  // Rest der Komponente...
}
```

## 8. Testing

### 8.1 Lokales Testing

```bash
npm run dev
```

1. Gehe zu http://localhost:3000
2. Gib deine E-Mail ein
3. Prüfe deine E-Mail auf Magic Link
4. Klicke auf den Link
5. Prüfe ob du angemeldet bist

### 8.2 Production Testing

1. Deploye deine Anwendung
2. Aktualisiere Site URL in Supabase
3. Teste mit echter Domain

## 9. Troubleshooting

### Häufige Probleme:

1. **Module nicht gefunden:**
   ```bash
   npm install @supabase/auth-helpers-nextjs
   ```

2. **Environment Variables nicht geladen:**
   - Prüfe `.env.local` Datei
   - Restarte den Development Server

3. **Magic Link funktioniert nicht:**
   - Prüfe DNS-Einträge
   - Prüfe SMTP-Konfiguration
   - Prüfe Redirect URLs

4. **E-Mails kommen nicht an:**
   - Prüfe Spam-Ordner
   - Prüfe SMTP-Logs
   - Prüfe Domain-Verifizierung

## 10. Sicherheitshinweise

- ✅ Verwende HTTPS in Production
- ✅ Speichere Environment Variables sicher
- ✅ Konfiguriere Rate Limiting
- ✅ Überwache E-Mail-Delivery
- ✅ Logge Security Events

---

**Fertig!** Deine Supabase Authentication ist jetzt eingerichtet. 🎯 