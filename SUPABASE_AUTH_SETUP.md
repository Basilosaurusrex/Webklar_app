# Supabase Authentication mit Magic Links - Komplette Setup-Anleitung

## Übersicht
Diese Anleitung zeigt, wie du Supabase Authentication mit Magic Links einrichtest, die über deine eigene Domain `support@webclar.com` verschickt werden.

## 1. Supabase Authentication konfigurieren

### 1.1 Supabase Dashboard einrichten

1. **Gehe zu deinem Supabase Dashboard**
   - Öffne https://supabase.com/dashboard
   - Wähle dein Projekt aus

2. **Authentication Settings öffnen**
   - Klicke auf "Authentication" im linken Menü
   - Gehe zu "Settings" → "General"

3. **Magic Link aktivieren**
   ```
   ✅ Enable magic links
   ✅ Enable email confirmations
   ```

4. **Site URL konfigurieren**
   ```
   Site URL: https://deine-domain.com
   Redirect URLs: 
   - https://deine-domain.com/auth/callback
   - http://localhost:3000/auth/callback (für Entwicklung)
   ```

### 1.2 E-Mail-Templates anpassen

1. **Gehe zu Authentication → Templates**
2. **Magic Link Template bearbeiten:**

```html
<!-- Magic Link Template -->
<h2>Willkommen bei Webklar!</h2>
<p>Klicke auf den Link unten, um deine E-Mail-Adresse zu bestätigen:</p>
<a href="{{ .ConfirmationURL }}">E-Mail bestätigen</a>
<p>Oder kopiere diesen Link in deinen Browser:</p>
<p>{{ .ConfirmationURL }}</p>
<p>Dieser Link ist 24 Stunden gültig.</p>
<p>Falls du diese E-Mail nicht angefordert hast, kannst du sie ignorieren.</p>
```

## 2. E-Mail-Provider einrichten

### Option A: Resend (Empfohlen)

1. **Resend Account erstellen**
   - Gehe zu https://resend.com
   - Erstelle einen kostenlosen Account

2. **Domain verifizieren**
   - Klicke auf "Domains" → "Add Domain"
   - Gib `webclar.com` ein
   - Folge den DNS-Anweisungen

3. **API Key generieren**
   - Gehe zu "API Keys"
   - Erstelle einen neuen API Key
   - Kopiere den Key

### Option B: Mailgun

1. **Mailgun Account erstellen**
   - Gehe zu https://mailgun.com
   - Erstelle einen kostenlosen Account

2. **Domain hinzufügen**
   - Klicke auf "Domains" → "Add Domain"
   - Gib `webclar.com` ein

3. **API Key generieren**
   - Gehe zu "Settings" → "API Keys"
   - Kopiere den Private API Key

## 3. DNS-Einträge in Porkbun konfigurieren

### 3.1 Für Resend:

1. **Gehe zu Porkbun Dashboard**
2. **Wähle deine Domain `webclar.com`**
3. **Gehe zu "DNS Records"**

**Füge diese Einträge hinzu:**

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

### 3.2 Für Mailgun:

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

## 4. Supabase mit E-Mail-Provider verbinden

### 4.1 Environment Variables setzen

Erstelle eine `.env.local` Datei:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Resend (Option A)
RESEND_API_KEY=your_resend_api_key

# Mailgun (Option B)
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=webclar.com
```

### 4.2 Supabase SMTP konfigurieren

**Für Resend:**
```
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP Username: resend
SMTP Password: [dein_resend_api_key]
From Email: support@webclar.com
```

**Für Mailgun:**
```
SMTP Host: smtp.mailgun.org
SMTP Port: 587
SMTP Username: [dein_mailgun_username]
SMTP Password: [dein_mailgun_password]
From Email: support@webclar.com
```

## 5. Code-Implementation

### 5.1 Supabase Client konfigurieren

```typescript
// lib/supabase.ts
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

### 5.2 Authentication Hook

```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}
```

### 5.3 Magic Link Authentication

```typescript
// components/MagicLinkAuth.tsx
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function MagicLinkAuth() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        setMessage(`Fehler: ${error.message}`)
      } else {
        setMessage('Magic Link wurde an deine E-Mail gesendet!')
      }
    } catch (error) {
      setMessage('Ein unerwarteter Fehler ist aufgetreten.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Anmelden</h2>
      <form onSubmit={handleSendMagicLink} className="space-y-4">
        <Input
          type="email"
          placeholder="deine@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Wird gesendet...' : 'Magic Link senden'}
        </Button>
      </form>
      {message && (
        <p className="mt-4 p-3 rounded bg-blue-50 text-blue-700">
          {message}
        </p>
      )}
    </div>
  )
}
```

### 5.4 Auth Callback Handler

```typescript
// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to the home page or dashboard
  return NextResponse.redirect(requestUrl.origin)
}
```

### 5.5 Geschützte Route Middleware

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If no session and trying to access protected route
  if (!session && req.nextUrl.pathname.startsWith('/protected')) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  // If session exists and trying to access auth page
  if (session && req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/protected', req.url))
  }

  return res
}

export const config = {
  matcher: ['/protected/:path*', '/auth/:path*']
}
```

## 6. Integration in deine Terminbuchung

### 6.1 Geschützte Terminbuchung

```typescript
// components/ProtectedAppointmentBooking.tsx
import { useAuth } from '@/hooks/useAuth'
import AppointmentBooking from './AppointmentBooking'
import MagicLinkAuth from './MagicLinkAuth'

export default function ProtectedAppointmentBooking() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Lade...</div>
  }

  if (!user) {
    return <MagicLinkAuth />
  }

  return (
    <div>
      <div className="mb-4 p-3 bg-green-50 rounded">
        ✅ Angemeldet als: {user.email}
      </div>
      <AppointmentBooking />
    </div>
  )
}
```

### 6.2 Datenbank-Eintrag nur nach Authentifizierung

```typescript
// components/AppointmentBooking.tsx (modifiziert)
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
    try {
      // ... deine bestehende Buchungslogik
    } catch (err) {
      console.error('Error:', err)
      setError('Ein Fehler ist aufgetreten.')
    }
  }

  // Rest der Komponente...
}
```

## 7. Testing

### 7.1 Lokales Testing

1. **Starte deine Anwendung:**
   ```bash
   npm run dev
   ```

2. **Teste Magic Link Flow:**
   - Gehe zu `/auth`
   - Gib deine E-Mail ein
   - Prüfe deine E-Mail auf Magic Link
   - Klicke auf den Link
   - Prüfe ob du angemeldet bist

3. **Teste geschützte Routen:**
   - Versuche auf `/protected` zuzugreifen ohne Anmeldung
   - Melde dich an und prüfe ob Zugriff funktioniert

### 7.2 Production Testing

1. **Deploye deine Anwendung**
2. **Aktualisiere Site URL in Supabase**
3. **Teste mit echter Domain**

## 8. Troubleshooting

### Häufige Probleme:

1. **Magic Link funktioniert nicht:**
   - Prüfe DNS-Einträge
   - Prüfe SMTP-Konfiguration
   - Prüfe Redirect URLs

2. **E-Mails kommen nicht an:**
   - Prüfe Spam-Ordner
   - Prüfe SMTP-Logs
   - Prüfe Domain-Verifizierung

3. **Session wird nicht gespeichert:**
   - Prüfe Cookie-Einstellungen
   - Prüfe HTTPS in Production

## 9. Sicherheitshinweise

- ✅ **HTTPS verwenden** in Production
- ✅ **Environment Variables** sicher speichern
- ✅ **Rate Limiting** für Magic Links
- ✅ **Session Timeout** konfigurieren
- ✅ **Logging** für Security Events

## 10. Nächste Schritte

1. **Implementiere die Code-Snippets**
2. **Konfiguriere DNS-Einträge**
3. **Teste lokal**
4. **Deploye und teste in Production**
5. **Überwache E-Mail-Delivery**

---

**Fertig!** Du hast jetzt eine vollständige Supabase Authentication mit Magic Links über deine eigene Domain eingerichtet. 🎯 