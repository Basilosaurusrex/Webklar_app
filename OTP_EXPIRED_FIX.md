# OTP Expired Error - Lösung

## 🚨 **Problem:**
```
error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired
```

## 🔍 **Ursachen:**

1. **Magic Link ist abgelaufen** (Standard: 24 Stunden)
2. **Magic Link wurde bereits verwendet**
3. **Falsche Redirect URL**
4. **Supabase-Konfiguration fehlerhaft**

## ✅ **Lösungen:**

### **1. Sofortige Lösung:**
- **Fordere einen neuen Magic Link an**
- Klicke auf "Verifizierung senden" erneut
- Prüfe dein E-Mail-Postfach für neuen Link

### **2. Supabase-Konfiguration prüfen:**

#### **A. Magic Link Settings:**
1. Gehe zu Supabase Dashboard
2. Klicke auf "Authentication" → "Settings" → "General"
3. Prüfe:
   ```
   ✅ Enable magic links
   ✅ Enable email confirmations
   Site URL: https://deine-domain.com (oder http://localhost:3000)
   Redirect URLs: 
   - http://localhost:3000/auth/callback
   - https://deine-domain.com/auth/callback
   ```

#### **B. E-Mail-Template prüfen:**
1. Gehe zu "Authentication" → "Templates"
2. Prüfe Magic Link Template:
   ```html
   <h2>Willkommen bei Webklar!</h2>
   <p>Klicke auf den Link unten, um deine E-Mail-Adresse zu bestätigen:</p>
   <a href="{{ .ConfirmationURL }}">E-Mail bestätigen</a>
   <p>Dieser Link ist 24 Stunden gültig.</p>
   ```

#### **C. SMTP-Konfiguration:**
1. Gehe zu "Authentication" → "Settings" → "SMTP"
2. Prüfe Resend-Konfiguration:
   ```
   SMTP Host: smtp.resend.com
   SMTP Port: 587
   SMTP Username: resend
   SMTP Password: [dein_resend_api_key]
   From Email: support@webclar.com
   ```

### **3. Environment Variables prüfen:**
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### **4. Magic Link Gültigkeit anpassen:**
1. Gehe zu Supabase Dashboard
2. Klicke auf "Authentication" → "Settings" → "General"
3. Suche nach "Magic Link Expiry"
4. Erhöhe auf 48 Stunden oder mehr

## 🔧 **Debugging:**

### **Console-Logs prüfen:**
```javascript
=== AUTH CALLBACK DEBUG ===
Code: null
Error: access_denied
Error Description: Email link is invalid or has expired
```

### **E-Mail-Versand testen:**
1. Gib eine neue E-Mail-Adresse ein
2. Klicke "Verifizierung senden"
3. Prüfe E-Mail-Postfach
4. Klicke sofort auf den Link

## 🚀 **Verbesserte Fehlerbehandlung:**

### **A. Auth Callback Route:**
- ✅ Erkennt OTP-Expired Fehler
- ✅ Leitet zu Auth-Seite mit Fehlermeldung
- ✅ Zeigt benutzerfreundliche Nachricht

### **B. Auth Page:**
- ✅ Zeigt Fehlermeldungen an
- ✅ Gibt Tipps für OTP-Expired
- ✅ Ermöglicht neue Magic Link Anfrage

### **C. EmailVerification:**
- ✅ Erkennt abgelaufene Links
- ✅ Zeigt spezifische Fehlermeldungen
- ✅ Ermöglicht erneute Anfrage

## 🧪 **Testing:**

### **Test 1: Neuer Magic Link**
1. Fülle Terminbuchungsformular aus
2. Gib E-Mail-Adresse ein
3. Klicke "Verifizierung senden"
4. Prüfe E-Mail-Postfach
5. Klicke sofort auf neuen Link

### **Test 2: Abgelaufener Link**
1. Warte 24+ Stunden
2. Klicke auf alten Magic Link
3. Prüfe Fehlermeldung
4. Fordere neuen Link an

### **Test 3: Doppelte Verwendung**
1. Verwende Magic Link
2. Versuche denselben Link erneut
3. Prüfe Fehlermeldung
4. Fordere neuen Link an

## 📊 **Erwartete Ergebnisse:**

### **Erfolgreich:**
```
✅ Session exchange successful
Redirect to: http://localhost:3000
```

### **Fehler:**
```
❌ Auth callback error: { error: 'access_denied', errorDescription: 'Email link is invalid or has expired' }
Redirect to: http://localhost:3000/auth?error=access_denied&error_description=Email+link+is+invalid+or+has+expired
```

## 🎯 **Nächste Schritte:**

1. **Fordere einen neuen Magic Link an**
2. **Prüfe Supabase-Konfiguration**
3. **Teste mit neuer E-Mail-Adresse**
4. **Überwache Console-Logs**

---

**Das OTP-Problem ist jetzt behoben und hat bessere Fehlerbehandlung!** 🎯 