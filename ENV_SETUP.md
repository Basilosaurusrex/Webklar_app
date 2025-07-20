# Environment Variables Setup

## Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Resend Configuration (optional - falls du Resend verwendest)
RESEND_API_KEY=your_resend_api_key_here
```

## Wo findest du diese Werte?

### 1. Supabase URL und Keys:
1. Gehe zu deinem Supabase Dashboard
2. Klicke auf "Settings" → "API"
3. Kopiere die Werte:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Resend API Key (optional):
1. Gehe zu https://resend.com
2. Klicke auf "API Keys"
3. Erstelle einen neuen API Key
4. Kopiere den Key → `RESEND_API_KEY`

## Wichtige Hinweise:

- ✅ Die `.env.local` Datei wird nicht in Git gespeichert
- ✅ Restarte den Development Server nach Änderungen
- ✅ `NEXT_PUBLIC_` Prefix ist wichtig für Client-seitige Variablen
- ✅ Verwende HTTPS URLs in Production

## Testing:

Nach dem Setup kannst du testen:

1. **Starte den Server neu:**
   ```bash
   npm run dev
   ```

2. **Gehe zu http://localhost:3000**
3. **Teste die Magic Link Anmeldung**
4. **Prüfe ob Terminbuchung funktioniert**

---

**Fertig!** Deine Environment Variables sind konfiguriert. 🎯 