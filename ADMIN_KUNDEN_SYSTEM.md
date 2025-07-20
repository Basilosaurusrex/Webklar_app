# Administrator Kunden-System

## 🎯 **Übersicht:**

### **Zugriff für Administratoren:**
- URL: `http://localhost:3000/kunden-projekte`
- Authentifizierung erforderlich
- Zeigt alle Kunden mit Termin-Status

## 📊 **Kunden-Anzeige:**

### **Wenn Kunden nicht angezeigt werden:**

#### **1. Prüfe Console-Logs:**
```javascript
=== FETCHING CUSTOMERS DEBUG ===
User: admin@example.com
User ID: abc123
Database response: { data: [...], error: null }
Number of customers found: 5
```

#### **2. Prüfe Datenbank:**
- Gehe zu Supabase Dashboard
- Tabelle `kunden_projekte` öffnen
- Prüfe ob Kunden vorhanden sind

#### **3. Prüfe RLS (Row Level Security):**
```sql
-- In Supabase SQL Editor
SELECT * FROM kunden_projekte;
```

## 🔄 **Flow für Administratoren:**

### **Schritt 1: Kunden-Projekte öffnen**
1. Gehe zu `http://localhost:3000/kunden-projekte`
2. Melde dich als Administrator an
3. Sieh alle Kunden mit Status

### **Schritt 2: Kunde auswählen**
- **Mit Termin:** Klicke "Daten anzeigen"
- **Ohne Termin:** Klicke "Termin starten"

### **Schritt 3: Termin starten (ohne Termin)**
1. Fragebogen wird automatisch angezeigt
2. Fülle alle Felder aus:
   - Persönliche Daten
   - Projektanforderungen
   - Service-Präferenzen
3. Klicke "Daten speichern"
4. Kunde wird aktualisiert

### **Schritt 4: Daten anzeigen (mit Termin)**
1. Vollständige Kundendaten werden angezeigt
2. Projektbeschreibung sichtbar
3. Verfügbare Services aufgelistet
4. "Daten aktualisieren" Button vorhanden

## 📱 **Features:**

### **Hauptseite (`/kunden-projekte`):**
- ✅ **Alle Kunden anzeigen** (aus Datenbank)
- ✅ **Suchfunktion** (Name, E-Mail)
- ✅ **Filter:** Alle / Mit Termin / Ohne Termin
- ✅ **Status-Badges** für jeden Kunden
- ✅ **"Termin starten"** Button (ohne Termin)
- ✅ **"Daten anzeigen"** Button (mit Termin)

### **Detail-Seite (`/kunden-projekte/[id]`):**
- ✅ **Kundendaten anzeigen** (wenn Termin vorhanden)
- ✅ **Automatischer Fragebogen** (wenn kein Termin)
- ✅ **Projektbeschreibung**
- ✅ **Verfügbare Services**
- ✅ **Aktionen:** Daten aktualisieren / Neuen Termin buchen

### **Fragebogen-Komponente:**
- ✅ **Persönliche Daten** (Name, E-Mail, Telefon)
- ✅ **Projektanforderungen** (Beschreibung)
- ✅ **Service-Präferenzen** (Interessierte Services)
- ✅ **Speichern & Abbrechen**

## 🎨 **UI/UX:**

### **Status-Badges:**
- 🟡 **Termin ausstehend** (Gelb) → "Termin starten"
- 🔵 **Termin geplant** (Blau) → "Daten anzeigen"
- 🟢 **Termin abgeschlossen** (Grün) → "Daten anzeigen"

### **Kunden-Karten:**
- ✅ **Avatar** mit User-Icon
- ✅ **Name & E-Mail**
- ✅ **Status-Badge**
- ✅ **Termin-Datum** (falls vorhanden)
- ✅ **Projektbeschreibung** (Vorschau)
- ✅ **"Termin starten"** oder **"Daten anzeigen"** Button

## 🔧 **Technische Implementierung:**

### **Datenbank-Abfrage:**
```javascript
const { data, error } = await supabase
  .from('kunden_projekte')
  .select('*')
  .order('created_at', { ascending: false });
```

### **Status-Berechnung:**
```javascript
const customersWithStatus = data?.map(customer => ({
  ...customer,
  has_appointment: !!customer.termin_datum,
  appointment_completed: !!customer.termin_datum && new Date(customer.termin_datum) < new Date()
})) || [];
```

### **Automatischer Fragebogen:**
```javascript
// Show questionnaire if no appointment
if (!customerWithStatus.has_appointment) {
  setShowQuestionnaire(true);
}
```

## 📊 **Testing:**

### **Test 1: Kunden anzeigen**
1. Gehe zu `/kunden-projekte`
2. Melde dich als Administrator an
3. Prüfe: Kunden werden angezeigt
4. Prüfe: Console-Logs zeigen Daten

### **Test 2: Termin starten**
1. Klicke auf Kunde ohne Termin
2. Prüfe: "Termin starten" Button
3. Klicke "Termin starten"
4. Prüfe: Fragebogen wird angezeigt
5. Fülle aus und speichere
6. Prüfe: Status ändert sich

### **Test 3: Daten anzeigen**
1. Klicke auf Kunde mit Termin
2. Prüfe: "Daten anzeigen" Button
3. Klicke "Daten anzeigen"
4. Prüfe: Vollständige Daten werden angezeigt

### **Test 4: Suchfunktion**
1. Suche nach Kundenname oder E-Mail
2. Prüfe: Gefilterte Ergebnisse

## 🎯 **Erwartetes Verhalten:**

### **Kunden ohne Termin:**
```
Klick → "Termin starten" → Fragebogen → Ausfüllen → Speichern → Status ändert sich
```

### **Kunden mit Termin:**
```
Klick → "Daten anzeigen" → Vollständige Daten → "Daten aktualisieren" → Fragebogen
```

### **Navigation:**
```
/kunden-projekte → Klick → /kunden-projekte/[id] → Zurück → /kunden-projekte
```

## 🚀 **Vorteile:**

### **✅ Administrator-Features:**
- Alle Kunden auf einen Blick
- Termin-Status-Übersicht
- Schnelle Datenaktualisierung

### **✅ Benutzerfreundlichkeit:**
- Automatische Fragebogen-Anzeige
- Klare Status-Indikatoren
- Intuitive Navigation

### **✅ Effizienz:**
- "Termin starten" für neue Kunden
- "Daten anzeigen" für bestehende Kunden
- Automatische Status-Erkennung

---

**Das Administrator Kunden-System ist jetzt vollständig implementiert!** 🎯 