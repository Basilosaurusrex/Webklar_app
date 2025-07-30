"use client";
import WebklarLogoHeader from '@/components/WebklarLogoHeader';
import WebklarFooter from '@/components/WebklarFooter';

export default function KontaktePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FEFAE0]">
      <WebklarLogoHeader />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full mx-auto">
          <h1 className="text-2xl font-bold mb-8 text-center">Kontakte</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Karte 1 */}
            <div className="bg-white/80 rounded-2xl shadow-2xl p-6 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-3xl text-gray-400">👤</div>
              <div className="font-bold text-lg mb-1">Kenso Grimm</div>
              <div className="text-sm text-gray-600 mb-2">CEO & Webentwickler</div>
              <div className="text-sm text-gray-800 mb-1">support@webklar.com</div>
              <div className="text-sm text-gray-800">+49 176 23726355</div>
            </div>
            {/* Karte 2 */}
            <div className="bg-white/80 rounded-2xl shadow-2xl p-6 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-3xl text-gray-400">👤</div>
              <div className="font-bold text-lg mb-1">Justin Klein</div>
              <div className="text-sm text-gray-600 mb-2">CEO & Kundenbetreuung</div>
              <div className="text-sm text-gray-800 mb-1">support@webklar.com</div>
              <div className="text-sm text-gray-800">+49 170 4969375</div>
            </div>
          </div>
        </div>
      </div>
      <WebklarFooter />
    </div>
  );
} 