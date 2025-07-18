"use client";
import WebklarLogoHeader from '@/components/WebklarLogoHeader';
import WebklarFooter from '@/components/WebklarFooter';

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FEFAE0]">
      <WebklarLogoHeader />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white/80 rounded-2xl shadow-2xl p-8 mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">Datenschutzerklärung</h1>
          <div className="space-y-4 text-gray-800 text-sm">
            <p><b>1. Allgemeines</b><br/>Wir nehmen den Schutz Ihrer Daten ernst. Diese Website verarbeitet personenbezogene Daten nur, soweit dies technisch und organisatorisch notwendig ist.</p>
            <p><b>2. Kontaktformular</b><br/>Wenn Sie uns per Formular Anfragen zukommen lassen, werden Ihre Angaben aus dem Formular inklusive der von Ihnen dort angegebenen Kontaktdaten zur Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.</p>
            <p><b>3. Hosting</b><br/>Unsere Website wird bei Netlify gehostet. Netlify verarbeitet personenbezogene Daten im Rahmen der Auftragsverarbeitung. Weitere Informationen finden Sie in der Datenschutzerklärung von Netlify.</p>
            <p><b>4. Cookies & externe Fonts</b><br/>Wir verwenden keine Cookies und keine externen Schriftarten.</p>
            <p><b>5. Trackingtools</b><br/>Optional: Wir nutzen datenschutzfreundliche Analyse-Tools wie Plausible. Es werden keine personenbezogenen Daten gespeichert.</p>
            <p><b>6. Ihre Rechte</b><br/>Sie haben jederzeit das Recht auf Auskunft, Berichtigung oder Löschung Ihrer gespeicherten Daten.</p>
          </div>
        </div>
      </div>
      <WebklarFooter />
    </div>
  );
} 