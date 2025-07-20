# Admin Termin-System - Vollständige Anleitung

## 🎯 **Neue Workflow-Logik:**

### **📋 Nur Termine - Keine Kunden ohne Termin**
- **Alle Kunden haben Termine** - Keine Kunden ohne Termin werden angezeigt
- **Termin-Status-Management** mit Live-Updates
- **Admin-Interface** für vollständige Datenbearbeitung

## 🔄 **Termin-Status-System:**

### **1. "Termin noch nicht begonnen" (Standard)**
```typescript
appointment_status: 'pending'
```
- **Standard-Status** für alle neuen Termine
- **Admin kann Termin starten** mit "Termin starten" Button
- **Zeigt:** "Termin noch nicht begonnen" Badge

### **2. "Termin läuft" (Aktiv)**
```typescript
appointment_status: 'running'
started_by: 'admin@email.com'
started_at: '2024-01-15T10:30:00Z'
```
- **Admin startet Termin** → Status wird "running"
- **Zeigt:** "Termin läuft" Badge + "Gestartet von: admin@email.com"
- **Andere Admins sehen:** Kollege XY ist im Gespräch
- **Admin kann Termin beenden** mit "Termin beenden" Button

### **3. "Termin abgeschlossen" (Fertig)**
```typescript
appointment_status: 'completed'
completed_at: '2024-01-15T11:30:00Z'
```
- **Admin beendet Termin** → Status wird "completed"
- **Zeigt:** "Termin abgeschlossen" Badge
- **Admin kann zurücksetzen** mit "Zurücksetzen" Button

## 🎛️ **Admin-Interface Features:**

### **📊 Kunden-Projekte Übersicht (`/kunden-projekte`)**
- **Nur Kunden mit Terminen** werden angezeigt
- **Live-Status-Updates** für alle Admins
- **Filter nach Status:** Alle, Nicht begonnen, Läuft, Abgeschlossen
- **Suche nach Name/E-Mail**
- **Status-Badges** mit Admin-Informationen
- **Aktions-Buttons** je nach Status

### **📝 Kunden-Details (`/kunden-projekte/[id]`)**
- **Vollständige Kundendaten** anzeigen
- **Termin-Status verwalten** mit Buttons
- **Daten bearbeiten** mit integriertem Formular
- **Live-Updates** für alle Admins

### **✏️ Datenbearbeitung (CustomerQuestionnaire)**
- **Alle Felder editierbar:** Name, E-Mail, Telefon, Termin, Projektbeschreibung
- **Automatische Updates** in der Datenbank
- **Validierung** und Fehlerbehandlung
- **Toast-Benachrichtigungen** für Feedback

## 🔧 **Technische Implementierung:**

### **Database Schema Updates:**
```sql
-- Neue Spalten in kunden_projekte Tabelle hinzufügen
ALTER TABLE kunden_projekte ADD COLUMN appointment_status TEXT DEFAULT 'pending';
ALTER TABLE kunden_projekte ADD COLUMN started_by TEXT;
ALTER TABLE kunden_projekte ADD COLUMN started_at TIMESTAMP;
ALTER TABLE kunden_projekte ADD COLUMN completed_at TIMESTAMP;
```

### **Status-Management Funktionen:**
```typescript
// Status aktualisieren
const updateAppointmentStatus = async (customerId: string, status: 'pending' | 'running' | 'completed') => {
  const updateData: any = { appointment_status: status };
  
  if (status === 'running') {
    updateData.started_by = user?.email;
    updateData.started_at = new Date().toISOString();
  } else if (status === 'completed') {
    updateData.completed_at = new Date().toISOString();
  }

  await supabase
    .from('kunden_projekte')
    .update(updateData)
    .eq('id', customerId);
};
```

### **Live-Status-Badges:**
```typescript
const getStatusBadge = (status: string, startedBy?: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="secondary">Termin noch nicht begonnen</Badge>;
    case 'running':
      return (
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-green-500">Termin läuft</Badge>
          {startedBy && (
            <span className="text-sm text-gray-600">(Gestartet von: {startedBy})</span>
          )}
        </div>
      );
    case 'completed':
      return <Badge variant="outline">Termin abgeschlossen</Badge>;
  }
};
```

## 🎯 **Admin-Workflow:**

### **1. Termin starten:**
1. **Gehe zu:** `/kunden-projekte`
2. **Finde Kunde** mit "Termin noch nicht begonnen"
3. **Klicke:** "Termin starten" Button
4. **Status wird:** "Termin läuft"
5. **Andere Admins sehen:** "Gestartet von: admin@email.com"

### **2. Termin beenden:**
1. **Gehe zu:** Kunden-Details
2. **Klicke:** "Termin beenden" Button
3. **Status wird:** "Termin abgeschlossen"
4. **Termin ist fertig**

### **3. Daten bearbeiten:**
1. **Gehe zu:** Kunden-Details
2. **Klicke:** "Daten bearbeiten" Button
3. **Bearbeite alle Felder** im Formular
4. **Klicke:** "Daten speichern"
5. **Daten werden sofort aktualisiert**

## 📈 **Vorteile des neuen Systems:**

### **✅ Klare Workflow-Struktur:**
- **Nur Termine** - Keine Verwirrung
- **Status-Tracking** für alle Termine
- **Admin-Koordination** durch Live-Updates

### **✅ Live-Kollaboration:**
- **Alle Admins sehen** aktuelle Status
- **Keine Doppelarbeit** durch Status-Tracking
- **Echte Team-Koordination**

### **✅ Vollständige Datenkontrolle:**
- **Alle Felder editierbar** zur Laufzeit
- **Validierung** und Fehlerbehandlung
- **Sofortige Updates** in der Datenbank

### **✅ Benutzerfreundlich:**
- **Intuitive Buttons** für alle Aktionen
- **Klare Status-Badges** mit Admin-Info
- **Responsive Design** für alle Geräte

## 🚀 **Nächste Schritte:**

### **1. Database Schema aktualisieren:**
```sql
-- Führe diese SQL-Befehle in Supabase aus
ALTER TABLE customers ADD COLUMN appointment_status TEXT DEFAULT 'pending';
ALTER TABLE customers ADD COLUMN started_by TEXT;
ALTER TABLE customers ADD COLUMN started_at TIMESTAMP;
ALTER TABLE customers ADD COLUMN completed_at TIMESTAMP;
```

### **2. System testen:**
1. **Server starten:** `npm run dev`
2. **Gehe zu:** `http://localhost:3000/kunden-projekte`
3. **Teste:** Status-Updates und Datenbearbeitung
4. **Prüfe:** Live-Updates zwischen Admins

### **3. Team einweisen:**
- **Workflow erklären** an das Team
- **Status-Bedeutung** verdeutlichen
- **Kollaboration** fördern

---

**Das neue Termin-System ist bereit!** 🎯 