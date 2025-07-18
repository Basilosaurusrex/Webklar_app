"use client";
import WebklarLogoHeader from '@/components/WebklarLogoHeader';
import WebklarFooter from '@/components/WebklarFooter';

export default function ImpressumPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FEFAE0]">
      <WebklarLogoHeader />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white/80 rounded-2xl shadow-2xl p-8 mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">Impressum</h1>
          <div className="space-y-4 text-gray-800">
            <div>
              <span className="font-semibold">Firmenname:</span> Musterfirma Webklar GmbH
            </div>
            <div>
              <span className="font-semibold">Adresse:</span> Musterstraße 1, 12345 Musterstadt
            </div>
            <div>
              <span className="font-semibold">Ansprechpartner:</span> Max Mustermann
            </div>
            <div>
              <span className="font-semibold">E-Mail:</span> info@webklar.com
            </div>
            <div>
              <span className="font-semibold">Telefon:</span> +49 123 456789
            </div>
            <div>
              <span className="font-semibold">Handelsregisternummer:</span> HRB 123456
            </div>
            <div>
              <span className="font-semibold">USt-ID:</span> DE123456789
            </div>
          </div>
        </div>
      </div>
      <WebklarFooter />
    </div>
  );
} 