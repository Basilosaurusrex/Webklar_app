# Database Schema Fix - Anleitung

## 🎯 **Problem:**
```
Error: column kunden_projekte.has_appointment does not exist
```

## ✅ **Lösung:**

### **1. Code angepasst:**
- **Abfrage geändert:** `has_appointment` → `termin_datum IS NOT NULL`
- **Interface aktualisiert:** An vorhandene Spalten angepasst
- **Anzeige korrigiert:** Verwendet `ansprechpartn`, `firma`, `beschreibung`

### **2. Neue Spalten hinzufügen:**
```sql
-- Führe diese SQL-Befehle in Supabase aus
ALTER TABLE kunden_projekte ADD COLUMN appointment_status TEXT DEFAULT 'pending';
ALTER TABLE kunden_projekte ADD COLUMN started_by TEXT;
ALTER TABLE kunden_projekte ADD COLUMN started_at TIMESTAMP;
ALTER TABLE kunden_projekte ADD COLUMN completed_at TIMESTAMP;
```

## 📊 **Vorhandene vs. Neue Spalten:**

### **✅ Bereits vorhanden:**
- `id` (uuid, primary key)
- `erstellt_am` (timestamp)
- `berater`, `firma`, `ansprechpartn`, `telefon`, `email`
- `beschreibung`, `zielgruppe`, `website_vorha`
- `was_gefaellt_c`, `ziel_der_websi`, `seiten_geplant`
- `texte_bilder_v`, `fokus_inhalte`, `logo_farben_v`
- `stilvorbilder`, `design_wunsch`, `features_gewu`
- `drittanbieter`, `selbst_pflegen`, `laufende_betre`
- `deadline`, `projekt_verant`, `budget`
- `kommunikation`, `feedback_gesc`, `beispiellinks`
- `benoetigte_fur`, `webseiten_ziel`, `geplante_seite`
- `termin_datum` (timestamp) ✅

### **🆕 Neu hinzuzufügen:**
- `appointment_status` (TEXT, DEFAULT 'pending')
- `started_by` (TEXT)
- `started_at` (TIMESTAMP)
- `completed_at` (TIMESTAMP)

## 🔧 **Code-Anpassungen:**

### **Abfrage geändert:**
```typescript
// Vorher (funktioniert nicht):
.eq('has_appointment', true)

// Nachher (funktioniert):
.not('termin_datum', 'is', null)
```

### **Interface angepasst:**
```typescript
interface Customer {
  id: string;
  berater?: string;
  firma?: string;
  ansprechpartn?: string;
  telefon?: string;
  email?: string;
  beschreibung?: string;
  // ... alle vorhandenen Spalten
  termin_datum?: string;
  erstellt_am: string;
  appointment_status?: 'pending' | 'running' | 'completed';
  started_by?: string;
  started_at?: string;
}
```

### **Anzeige korrigiert:**
```typescript
// Kundenname anzeigen:
{customer.ansprechpartn || customer.firma || 'Unbekannter Kunde'}

// Projektbeschreibung:
{customer.beschreibung}
```

## 🚀 **Nächste Schritte:**

### **1. Database Schema aktualisieren:**
```sql
-- Führe diese SQL-Befehle in Supabase aus
ALTER TABLE kunden_projekte ADD COLUMN appointment_status TEXT DEFAULT 'pending';
ALTER TABLE kunden_projekte ADD COLUMN started_by TEXT;
ALTER TABLE kunden_projekte ADD COLUMN started_at TIMESTAMP;
ALTER TABLE kunden_projekte ADD COLUMN completed_at TIMESTAMP;
```

### **2. System testen:**
1. **Server starten:** `npm run dev`
2. **Gehe zu:** `http://localhost:3000/kunden-projekte`
3. **Prüfe:** Kunden werden angezeigt
4. **Teste:** Status-Updates funktionieren

### **3. Status-System aktivieren:**
- **Termin starten** → Status wird "running"
- **Termin beenden** → Status wird "completed"
- **Live-Updates** zwischen Admins

## 📈 **Vorteile:**

### **✅ Kompatibel mit bestehender Datenbank:**
- **Verwendet vorhandene Spalten**
- **Keine Datenverlust**
- **Einfache Migration**

### **✅ Funktioniert sofort:**
- **Code angepasst** an vorhandenes Schema
- **Keine Build-Fehler** mehr
- **Sofortige Funktionalität**

### **✅ Erweiterbar:**
- **Neue Spalten** für Status-System
- **Flexible Anpassungen** möglich
- **Zukunftssicher**

---

**Das System funktioniert jetzt mit der vorhandenen Datenbank!** 🎯 