"use client";
import WebklarLogoHeader from '@/components/WebklarLogoHeader';
import WebklarFooter from '@/components/WebklarFooter';

export default function AgbPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FEFAE0]">
      <WebklarLogoHeader />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white/80 rounded-2xl shadow-2xl p-8 mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">Allgemeine Geschäftsbedingungen (AGB)</h1>
          <div className="space-y-4 text-gray-800 text-sm">
            <div>
              <b>1. Vertragsabschluss</b><br/>
              Ein Vertrag kommt durch schriftliche Bestätigung oder Beginn der Ausführung zustande.
            </div>
            <div>
              <b>2. Zahlungsbedingungen</b><br/>
              Rechnungen sind innerhalb von 14 Tagen nach Erhalt ohne Abzug zahlbar. Bei Zahlungsverzug behalten wir uns das Recht vor, Leistungen einzustellen.
            </div>
            <div>
              <b>3. Hosting & Support</b><br/>
              Wir bieten Hosting und Support nach individueller Vereinbarung. Für Ausfälle, die außerhalb unseres Einflussbereichs liegen, übernehmen wir keine Haftung.
            </div>
            <div>
              <b>4. Kündigung & Haftung</b><br/>
              Verträge können mit einer Frist von 4 Wochen zum Monatsende gekündigt werden. Für Schäden haften wir nur bei Vorsatz oder grober Fahrlässigkeit.
            </div>
          </div>
        </div>
      </div>
      <WebklarFooter />
    </div>
  );
} 