"use client";
import WebklarLogoHeader from '@/components/WebklarLogoHeader';
import WebklarFooter from '@/components/WebklarFooter';

export default function AgbPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FEFAE0]">
      <WebklarLogoHeader />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-white/80 rounded-2xl shadow-2xl p-8 mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">Allgemeine Geschäftsbedingungen (AGB)</h1>
          <div className="space-y-6 text-gray-800 text-sm">
            
            <div>
              <h2 className="text-lg font-semibold mb-2">Geltung</h2>
              <p>Diese AGB gelten für alle Dienstleistungen, die Webklar gegenüber Geschäftskunden (B2B) erbringt – insbesondere Webentwicklung, Hosting, Wartung und SEO.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Vertrag</h2>
              <p>Ein Vertrag entsteht durch schriftliche oder digitale Bestätigung (z. B. E-Mail). Absprachen sind verbindlich, sobald sie von beiden Seiten akzeptiert wurden.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Leistungen</h2>
              <p>Die Leistungen richten sich nach individueller Absprache. Änderungen oder Zusatzleistungen müssen gesondert vereinbart werden.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Zahlung</h2>
              <p>Zahlungen sind innerhalb von 14 Tagen nach Rechnungsstellung fällig, sofern nichts anderes vereinbart wurde. Alle Preise zzgl. gesetzlicher MwSt.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Inhalte</h2>
              <p>Für bereitgestellte Inhalte (Texte, Bilder etc.) ist der Kunde verantwortlich. Webklar übernimmt keine Haftung für etwaige Urheberrechtsverletzungen durch Kundenmaterial.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Haftung</h2>
              <p>Webklar haftet nur für grob fahrlässige oder vorsätzliche Pflichtverletzungen. Für technische Störungen wird keine Garantie übernommen, es sei denn, sie wurden durch Webklar verursacht.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Rechte</h2>
              <p>Die Rechte an entwickelten Designs und Quellcodes bleiben bis zur vollständigen Bezahlung bei Webklar. Danach erhält der Kunde ein einfaches Nutzungsrecht.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Datenschutz</h2>
              <p>Kundendaten werden nur im Rahmen der DSGVO verarbeitet. Eine separate Datenschutzerklärung wird zur Verfügung gestellt.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Gerichtsstand</h2>
              <p>Gerichtsstand ist, soweit gesetzlich zulässig, der Sitz des Unternehmens Webklar.</p>
            </div>

          </div>
        </div>
      </div>
      <WebklarFooter />
    </div>
  );
} 