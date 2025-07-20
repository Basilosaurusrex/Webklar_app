# Magic Link Setup Guide

## 🎯 **Problem:**
- Webseite sendet "Email Verification Sign" (funktioniert nicht)
- Supabase Dashboard sendet "Magic Link" (funktioniert)

## 🔧 **Lösung: Supabase Auth konfigurieren**

### **Schritt 1: Supabase Dashboard öffnen**
1. Gehe zu [supabase.com](https://supabase.com)
2. Wähle dein Projekt aus
3. Gehe zu **Authentication** → **Settings**

### **Schritt 2: Email Templates konfigurieren**
1. **Magic Link Template:**
   - Gehe zu **Email Templates**
   - Wähle **Magic Link** aus
   - Stelle sicher, dass der Template aktiviert ist

2. **OTP Template deaktivieren:**
   - Gehe zu **Email Templates**
   - Wähle **OTP** aus
   - Deaktiviere das Template oder ändere die Einstellungen

### **Schritt 3: Auth Settings anpassen**
1. **Gehe zu Authentication → Settings**
2. **Email Auth konfigurieren:**
   ```
   ✅ Enable email confirmations
   ✅ Enable magic link
   ❌ Disable OTP (One-Time Password)
   ```

### **Schritt 4: Redirect URLs konfigurieren**
1. **Site URL:** `http://localhost:3000`
2. **Redirect URLs:**
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/auth/callback*
   ```

### **Schritt 5: SMTP Settings prüfen**
1. **Gehe zu Authentication → Settings → SMTP**
2. **Stelle sicher, dass Resend konfiguriert ist:**
   ```
   Host: smtp.resend.com
   Port: 587
   Username: resend
   Password: [dein-resend-api-key]
   ```

## 🔄 **Alternative: Code-basierte Lösung**

### **Option 1: signInWithOtp mit Magic Link Flow**
```javascript
const { data, error } = await supabase.auth.signInWithOtp({
  email: email,
  options: {
    shouldCreateUser: true,
    data: {
      appointment_booking: true
    }
  }
});
```

### **Option 2: signUp mit Magic Link**
```javascript
const { data, error } = await supabase.auth.signUp({
  email: email,
  password: 'temporary-password',
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`,
    data: {
      appointment_booking: true
    }
  }
});
```

### **Option 3: Custom Magic Link**
```javascript
const { data, error } = await supabase.auth.signInWithOtp({
  email: email,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`,
    shouldCreateUser: true
  }
});
```

## 🎯 **Empfohlene Lösung:**

### **1. Supabase Dashboard konfigurieren:**
- Deaktiviere OTP in Auth Settings
- Aktiviere Magic Link in Auth Settings
- Konfiguriere Email Templates

### **2. Code anpassen:**
```javascript
// Verwende signInWithOtp mit Magic Link Konfiguration
const { data, error } = await supabase.auth.signInWithOtp({
  email: verificationEmail,
  options: {
    shouldCreateUser: true,
    data: {
      appointment_booking: true,
      email: verificationEmail
    }
  }
});
```

### **3. Auth Callback anpassen:**
```javascript
// Handle both code and token-based auth
if (code || accessToken) {
  // ... existing code
}
```

## 📊 **Testing:**

### **Test 1: Magic Link vs OTP**
1. **Magic Link:** Sollte direkt zur Auth Callback URL führen
2. **OTP:** Sollte eine Verifizierungsseite anzeigen

### **Test 2: E-Mail-Inhalt**
1. **Magic Link E-Mail:** Enthält direkten Link zur Callback URL
2. **OTP E-Mail:** Enthält Verifizierungscode

### **Test 3: Auth Flow**
1. **Magic Link:** Direkte Authentifizierung
2. **OTP:** Zusätzlicher Verifizierungsschritt

## 🔍 **Debugging:**

### **Console-Logs prüfen:**
```javascript
=== MAGIC LINK VERIFICATION DEBUG ===
Sending magic link to: kenso.gri@gmail.com
Supabase magic link response: { data: {...}, error: null }
Magic link sent successfully
```

### **Network-Tab prüfen:**
- POST zu `/auth/v1/otp`
- Response sollte `{ "message": "Magic link sent" }` enthalten

### **E-Mail-Inhalt prüfen:**
- **Magic Link:** Direkter Link zur Callback URL
- **OTP:** Verifizierungscode ohne Link

---

**Nach der Konfiguration sollte die Webseite echte Magic Links senden!** 🎯 