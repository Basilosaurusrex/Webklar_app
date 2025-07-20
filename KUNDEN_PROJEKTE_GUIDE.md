# Kunden-Projekte System

## 🎯 **Übersicht:**

### **Zugriff:**
- URL: `http://localhost:3000/kunden-projekte`
- Authentifizierung erforderlich
- Zeigt alle Kunden mit Termin-Status

## 📊 **Kunden-Status:**

### **1. Mit Termin** ✅
- **Status:** "Termin geplant" oder "Termin abgeschlossen"
- **Aktion:** "Daten anzeigen"
- **Anzeige:** Vollständige Kundendaten und Projektbeschreibung

### **2. Ohne Termin** ⚠️
- **Status:** "Termin ausstehend"
- **Aktion:** "Fragebogen"
- **Anzeige:** Automatischer Fragebogen zur Datenaktualisierung

## 🔄 **Flow-Logik:**

### **Wenn Termin vorhanden:**
```
Kunde öffnen → Vollständige Daten anzeigen → "Daten aktualisieren" Button
```

### **Wenn kein Termin:**
```
Kunde öffnen → Automatischer Fragebogen → Daten aktualisieren → Status ändert sich
```

## 📱 **Features:**

### **Hauptseite (`/kunden-projekte`):**
- ✅ **Alle Kunden anzeigen**
- ✅ **Suchfunktion** (Name, E-Mail)
- ✅ **Filter:** Alle / Mit Termin / Ohne Termin
- ✅ **Status-Badges** für jeden Kunden
- ✅ **Klickbare Karten** → Detail-Seite

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
- 🟡 **Termin ausstehend** (Gelb)
- 🔵 **Termin geplant** (Blau)
- 🟢 **Termin abgeschlossen** (Grün)

### **Kunden-Karten:**
- ✅ **Avatar** mit User-Icon
- ✅ **Name & E-Mail**
- ✅ **Status-Badge**
- ✅ **Termin-Datum** (falls vorhanden)
- ✅ **Projektbeschreibung** (Vorschau)
- ✅ **Hover-Effekte**

### **Detail-Ansicht:**
- ✅ **Großer Header** mit Kunden-Avatar
- ✅ **Zwei-Spalten-Layout**
- ✅ **Kundendaten** (links)
- ✅ **Services & Aktionen** (rechts)

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

### **Test 1: Kunden mit Termin**
1. Gehe zu `/kunden-projekte`
2. Klicke auf Kunde mit Termin
3. Prüfe: Vollständige Daten werden angezeigt
4. Prüfe: "Daten aktualisieren" Button vorhanden

### **Test 2: Kunden ohne Termin**
1. Gehe zu `/kunden-projekte`
2. Klicke auf Kunde ohne Termin
3. Prüfe: Fragebogen wird automatisch angezeigt
4. Fülle Fragebogen aus und speichere
5. Prüfe: Status ändert sich

### **Test 3: Suchfunktion**
1. Gehe zu `/kunden-projekte`
2. Suche nach Kundenname oder E-Mail
3. Prüfe: Gefilterte Ergebnisse

### **Test 4: Filter**
1. Gehe zu `/kunden-projekte`
2. Klicke "Mit Termin" Filter
3. Prüfe: Nur Kunden mit Termin angezeigt
4. Klicke "Ohne Termin" Filter
5. Prüfe: Nur Kunden ohne Termin angezeigt

## 🎯 **Erwartetes Verhalten:**

### **Kunden mit Termin:**
```
Klick → Vollständige Daten → "Daten aktualisieren" → Fragebogen → Speichern
```

### **Kunden ohne Termin:**
```
Klick → Automatischer Fragebogen → Ausfüllen → Speichern → Status ändert sich
```

### **Navigation:**
```
/kunden-projekte → Klick → /kunden-projekte/[id] → Zurück → /kunden-projekte
```

## 🚀 **Vorteile:**

### **✅ Benutzerfreundlichkeit:**
- Automatische Fragebogen-Anzeige
- Klare Status-Indikatoren
- Intuitive Navigation

### **✅ Effizienz:**
- Keine manuellen Schritte
- Automatische Status-Erkennung
- Schnelle Datenaktualisierung

### **✅ Professionalität:**
- Moderne UI/UX
- Responsive Design
- Klare Status-Kommunikation

---

**Das Kunden-Projekte-System ist jetzt vollständig implementiert!** 🎯 