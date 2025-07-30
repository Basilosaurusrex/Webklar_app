# 🎯 Professional Appointment Booking System

Ein professionelles Terminbuchungssystem mit Admin-Dashboard für Kundenprojekte und strukturierte Kundenbefragung.

## ✨ Features

### 📅 **Terminbuchung**
- **E-Mail-Verifikation** mit Supabase Auth
- **Automatische Bestätigung** nach Klick auf E-Mail-Link
- **Seamless User Flow** mit automatischen Weiterleitungen
- **Responsive Design** für alle Geräte

### 🏢 **Admin-Dashboard**
- **Professionelles UI** mit Glassmorphism-Design
- **Live-Status-Updates** für Termine
- **Strukturierte Kundenbefragung** mit 6 Hauptbereichen
- **Fortschritts-Tracking** in Echtzeit
- **Kreuz und quer Navigation** für effiziente Arbeit

### 📊 **Kundenprojekte Management**
- **Termin-Status-System:** Wartend → Läuft → Abgeschlossen
- **Live-Kollaboration** zwischen Admins
- **Vollständige Datenbearbeitung** in Echtzeit
- **Strukturierte Projektübersicht** für produktive Arbeit

## 🚀 Quick Start

### **1. Repository klonen**
```bash
git clone https://github.com/yourusername/appointment-booking-system.git
cd appointment-booking-system
```

### **2. Dependencies installieren**
```bash
npm install
```

### **3. Environment Variables setzen**
```bash
# .env.local erstellen
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **4. Development Server starten**
```bash
npm run dev
```

### **5. Browser öffnen**
```
http://localhost:3000
```

## 🛠️ Technologie-Stack

### **Frontend**
- **Next.js 14** mit App Router
- **React 18** mit TypeScript
- **TailwindCSS** für Styling
- **shadcn/ui** für UI-Komponenten
- **Lucide React** für Icons

### **Backend**
- **Supabase** für Datenbank und Auth
- **PostgreSQL** als Datenbank
- **Row Level Security (RLS)** für Sicherheit

### **Deployment**
- **Vercel** (empfohlen)
- **Netlify**
- **Any Static Hosting**

## 📋 Projektstruktur

```
project/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentifizierung
│   ├── kunden-projekte/          # Admin Dashboard
│   ├── success/                  # Erfolgs-Seite
│   └── admin-login/              # Admin Login
├── components/                   # React Komponenten
│   ├── ui/                      # shadcn/ui Komponenten
│   ├── AppointmentStatus.tsx     # Termin-Status
│   └── CustomerQuestionnaire.tsx # Kundenbefragung
├── hooks/                       # Custom React Hooks
├── lib/                         # Utilities
├── middleware.ts                 # Next.js Middleware
└── docs/                        # Dokumentation
```

## 🎯 Workflow

### **1. Kunde bucht Termin**
```
Kunde → Terminbuchung → E-Mail-Verifikation → Automatische Bestätigung → Erfolgs-Seite
```

### **2. Admin verwaltet Termine**
```
Admin → Kunden-Projekte → Termin starten → Befragung → Projektarbeit
```

### **3. Strukturierte Kundenbefragung**
- **Kontaktdaten** (Firma, Ansprechpartner, E-Mail, Telefon)
- **Projektinfo** (Beschreibung, Zielgruppe, Website-Ziele)
- **Design & Features** (Design-Wünsche, Features, Stilvorbilder)
- **Technische Details** (Integrationen, Funktionen, Betreuung)
- **Zeitplan & Budget** (Deadline, Budget, Kommunikation)

## 🔧 Konfiguration

### **Supabase Setup**
1. **Projekt erstellen** auf [supabase.com](https://supabase.com)
2. **Database Schema** importieren (siehe `docs/`)
3. **Environment Variables** setzen
4. **Row Level Security** aktivieren

### **Email Setup**
1. **SMTP Provider** konfigurieren
2. **E-Mail-Templates** anpassen
3. **Domain-Verifikation** durchführen

## 📚 Dokumentation

### **Setup Guides**
- [Installation Guide](INSTALLATION_GUIDE.md)
- [Environment Setup](ENV_SETUP.md)
- [Supabase Auth Setup](SUPABASE_AUTH_SETUP.md)

### **Feature Guides**
- [Admin Dashboard](ADMIN_TERMIN_SYSTEM.md)
- [Database Schema](DATABASE_SCHEMA_FIX.md)
- [E-Mail-Verifikation Setup](EMAIL_VERIFICATION_SETUP.md)

### **Troubleshooting**
- [Database Debug](DATABASE_DEBUG_GUIDE.md)
- [Next.js Fixes](NEXTJS_CLIENT_SERVER_FIX.md)
- [Auth Flow](SUCCESSFUL_AUTH_FLOW.md)

## 🎨 Design Features

### **Professional UI**
- **Glassmorphism-Effekt** mit Backdrop-Blur
- **Gradient-Hintergründe** für modernen Look
- **Responsive Design** für alle Geräte
- **Intuitive Navigation** mit Icons

### **User Experience**
- **Live-Updates** für alle Status-Änderungen
- **Fortschritts-Balken** für Befragung
- **Toast-Benachrichtigungen** für Feedback
- **Loading States** für bessere UX

## 🔒 Sicherheit

### **Authentifizierung**
- **E-Mail-Verifikation** ohne Passwörter
- **Automatische Bestätigung** nach Klick auf E-Mail-Link
- **Session Management** mit Supabase

### **Datenbank-Sicherheit**
- **Row Level Security (RLS)** aktiviert
- **Prepared Statements** gegen SQL-Injection
- **Input Validation** auf Client und Server

## 🚀 Deployment

### **Vercel (Empfohlen)**
```bash
npm install -g vercel
vercel
```

### **Environment Variables**
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

1. **Fork** das Repository
2. **Feature Branch** erstellen (`git checkout -b feature/AmazingFeature`)
3. **Commit** Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. **Push** zum Branch (`git push origin feature/AmazingFeature`)
5. **Pull Request** erstellen

## 📄 License

Dieses Projekt ist unter der MIT License lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

## 🙏 Credits

- **shadcn/ui** für UI-Komponenten
- **Lucide React** für Icons
- **Supabase** für Backend-Services
- **Next.js** für das Framework

---

**Entwickelt mit ❤️ für professionelle Terminbuchung und Kundenprojektverwaltung**
