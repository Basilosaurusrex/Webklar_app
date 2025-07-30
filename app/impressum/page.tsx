"use client";
import WebklarLogoHeader from '@/components/WebklarLogoHeader';
import WebklarFooter from '@/components/WebklarFooter';

export default function ImpressumPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FEFAE0]">
      <WebklarLogoHeader />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white/80 rounded-2xl shadow-2xl p-8 mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">Impressum</h1>
          <div className="space-y-4 text-gray-800">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Angaben gemäß § 5 TMG</h2>
            </div>
            
            <div>
              <span className="font-semibold">Firmenname:</span> Webklar IT-Dienstleistungen GbR
            </div>
            <div>
              <span className="font-semibold">Adresse:</span> Am Schwimmbad 10, 67722 Winnweiler
            </div>
            
            <div className="mt-4">
              <span className="font-semibold">Vertreten durch:</span>
              <div className="ml-4 mt-1">
                <div>Justin Klein</div>
                <div>Kenso Grimm</div>
              </div>
            </div>
            
            <div className="mt-4">
              <span className="font-semibold">Kontakt:</span>
              <div className="ml-4 mt-1">
                <div>Telefon: 0170 4969375</div>
                <div>E-Mail: support@webklar.com</div>
              </div>
            </div>
            
            <div className="mt-4">
              <span className="font-semibold">Umsatzsteuer:</span>
              <div className="ml-4 mt-1">
                <div>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: nicht vorhanden</div>
                <div className="text-sm text-gray-600 mt-1">(Kleinunternehmerregelung)</div>
              </div>
            </div>
            
            <div className="mt-4">
              <span className="font-semibold">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</span>
              <div className="ml-4 mt-1">
                <div>Justin Klein & Kenso Grimm</div>
                <div>Am Schwimmbad 10, 67722 Winnweiler</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <WebklarFooter />
    </div>
  );
} 