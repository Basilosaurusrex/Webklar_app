# Testing Guide - E-Mail-Verifizierung

## 🔍 **Debugging-Schritte:**

### **1. Environment Variables prüfen:**
```bash
# .env.local sollte enthalten:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### **2. Supabase Dashboard prüfen:**
1. Gehe zu deinem Supabase Dashboard
2. Klicke auf "Authentication" → "Settings" → "General"
3. Prüfe:
   - ✅ Enable magic links
   - ✅ Enable email confirmations
   - ✅ Site URL ist korrekt
   - ✅ Redirect URLs sind korrekt

### **3. E-Mail-Provider prüfen:**
1. Gehe zu "Authentication" → "Settings" → "SMTP"
2. Prüfe SMTP-Konfiguration:
   ```
   SMTP Host: smtp.resend.com
   SMTP Port: 587
   SMTP Username: resend
   SMTP Password: [dein_resend_api_key]
   From Email: support@webclar.com
   ```

### **4. Console-Logs prüfen:**
1. Öffne Browser Developer Tools (F12)
2. Gehe zu "Console" Tab
3. Führe Terminbuchung durch
4. Schaue nach Debug-Logs:
   - `=== EMAIL VERIFICATION DEBUG ===`
   - `Sending verification email to:`
   - `Supabase auth response:`

### **5. E-Mail-Versand testen:**
1. Gib eine echte E-Mail-Adresse ein
2. Klicke auf "Verifizierung senden"
3. Prüfe dein E-Mail-Postfach
4. Schaue auch in Spam-Ordner

## 🚨 **Häufige Probleme:**

### **Problem 1: "Supabase auth error"**
**Lösung:**
- Prüfe Environment Variables
- Prüfe Supabase URL und Keys
- Prüfe SMTP-Konfiguration

### **Problem 2: "Rate limit"**
**Lösung:**
- Warte 60 Sekunden
- Prüfe Supabase Rate Limits
- Verwende andere E-Mail-Adresse

### **Problem 3: E-Mail kommt nicht an**
**Lösung:**
- Prüfe Spam-Ordner
- Prüfe SMTP-Logs in Supabase
- Prüfe DNS-Einträge für Domain

### **Problem 4: "Module not found"**
**Lösung:**
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

## 🧪 **Test-Szenarien:**

### **Szenario 1: Erfolgreicher Flow**
1. Fülle Terminbuchungsformular aus
2. Klicke "Termin anfragen"
3. Gib E-Mail-Adresse ein
4. Klicke "Verifizierung senden"
5. Prüfe E-Mail-Postfach
6. Klicke auf Magic Link
7. Prüfe ob Termin gespeichert wurde

### **Szenario 2: Fehlerbehandlung**
1. Gib ungültige E-Mail ein
2. Prüfe Fehlermeldung
3. Gib gültige E-Mail ein
4. Teste Rate Limit

### **Szenario 3: DB-Eintrag prüfen**
1. Führe erfolgreichen Flow durch
2. Gehe zu Supabase Dashboard
3. Prüfe `kunden_projekte` Tabelle
4. Prüfe ob Termin korrekt gespeichert wurde

## 🔧 **Debug-Commands:**

```bash
# Development Server starten
npm run dev

# Dependencies prüfen
npm list @supabase/supabase-js
npm list @supabase/auth-helpers-nextjs

# Environment Variables prüfen
echo $NEXT_PUBLIC_SUPABASE_URL
```

## 📊 **Erwartete Console-Logs:**

```
=== EMAIL VERIFICATION DEBUG ===
Sending verification email to: test@example.com
Current origin: http://localhost:3000
Redirect URL: http://localhost:3000/auth/callback
Supabase auth response: { data: {...}, error: null }
Verification email sent successfully
```

## 🎯 **Erfolgsindikatoren:**

- ✅ E-Mail wird gesendet (keine Fehler in Console)
- ✅ Magic Link funktioniert (User wird authentifiziert)
- ✅ Termin wird in DB gespeichert
- ✅ Erfolgsseite wird angezeigt

---

**Führe diese Tests durch und prüfe die Console-Logs!** 🔍 