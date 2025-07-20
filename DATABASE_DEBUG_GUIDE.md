# Datenbank Debug Guide

## 🎯 **Problem:**
```
Error: column kunden_projekte.created_at does not exist
```

## 🔧 **Lösung:**

### **Schritt 1: Datenbank-Struktur prüfen**
1. Gehe zu **Supabase Dashboard**
2. **Table Editor** → **kunden_projekte**
3. Prüfe welche Spalten vorhanden sind

### **Schritt 2: Erwartete Spalten:**
```sql
-- Erwartete Spalten in kunden_projekte:
- id (uuid, primary key)
- name (text)
- email (text)
- telefon (text, optional)
- termin_datum (timestamp, optional)
- projekt_beschreibung (text, optional)
- created_at (timestamp, optional) ← FEHLT!
- updated_at (timestamp, optional) ← FEHLT!
```

### **Schritt 3: Fehlende Spalten hinzufügen**
```sql
-- In Supabase SQL Editor ausführen:
ALTER TABLE kunden_projekte 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Trigger für updated_at:
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_kunden_projekte_updated_at 
    BEFORE UPDATE ON kunden_projekte 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### **Schritt 4: Bestehende Daten aktualisieren**
```sql
-- Für bestehende Einträge created_at setzen:
UPDATE kunden_projekte 
SET created_at = NOW() 
WHERE created_at IS NULL;
```

## 📊 **Alternative Lösung (ohne created_at):**

### **Code anpassen:**
```javascript
// Statt created_at verwende id für Sortierung
const { data, error } = await supabase
  .from('kunden_projekte')
  .select('*')
  .order('id', { ascending: false });
```

### **Datum-Anzeige anpassen:**
```javascript
// Sichere Datum-Formatierung
const formatDate = (dateString: string) => {
  if (!dateString) return 'Nicht verfügbar';
  
  try {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Ungültiges Datum';
  }
};
```

## 🔍 **Debugging:**

### **1. Console-Logs prüfen:**
```javascript
=== FETCHING CUSTOMERS DEBUG ===
User: kenso.gri@gmail.com
User ID: cfd854f6-954d-483e-a208-98b0045bf4c3
Database response: { data: [...], error: null }
Number of customers found: 5
```

### **2. Datenbank direkt prüfen:**
```sql
-- In Supabase SQL Editor:
SELECT * FROM kunden_projekte LIMIT 5;
```

### **3. Spalten-Struktur prüfen:**
```sql
-- Zeige alle Spalten:
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'kunden_projekte';
```

## 🚀 **Empfohlene Lösung:**

### **Option 1: Spalten hinzufügen (empfohlen)**
1. Führe SQL-Befehle aus (Schritt 3)
2. Code bleibt unverändert
3. Vollständige Funktionalität

### **Option 2: Code anpassen**
1. Verwende `id` statt `created_at` für Sortierung
2. Sichere Datum-Formatierung
3. Weniger Funktionalität

## 📈 **Testing:**

### **Nach der Lösung:**
1. Gehe zu `/kunden-projekte`
2. Prüfe: Kunden werden angezeigt
3. Prüfe: Console-Logs zeigen keine Fehler
4. Prüfe: Sortierung funktioniert

---

**Wähle Option 1 für vollständige Funktionalität!** 🎯 