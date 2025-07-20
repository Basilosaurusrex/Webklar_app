"use client";

import { useEffect, useState } from 'react';
import { CheckCircle, Calendar, Mail, Clock } from "lucide-react";
import { colors } from '@/lib/colors';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ backgroundColor: colors.background }}>
      <div className="w-full max-w-md">
        <div 
          className="p-8 rounded-3xl shadow-lg backdrop-blur-sm text-center"
          style={{ backgroundColor: `${colors.background}F0` }}
        >
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
               style={{ backgroundColor: `${colors.primary}20` }}>
            <CheckCircle className="w-12 h-12" style={{ color: colors.primary }} />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>
            Termin erfolgreich gebucht! 🎉
          </h1>

          <p className="text-lg mb-6" style={{ color: colors.secondary }}>
            Ihr Termin wurde bestätigt und in unserem System gespeichert.
          </p>

          {/* Appointment Details */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3 p-4 rounded-xl border-2"
                 style={{ 
                   backgroundColor: `${colors.primary}10`,
                   borderColor: colors.primary 
                 }}>
              <Calendar className="w-5 h-5" style={{ color: colors.primary }} />
              <span className="text-sm" style={{ color: colors.secondary }}>
                <strong>Termin:</strong> Bestätigt und gespeichert
              </span>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-xl border-2"
                 style={{ 
                   backgroundColor: `${colors.primary}10`,
                   borderColor: colors.primary 
                 }}>
              <Mail className="w-5 h-5" style={{ color: colors.primary }} />
              <span className="text-sm" style={{ color: colors.secondary }}>
                <strong>E-Mail:</strong> Verifiziert und bestätigt
              </span>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-xl border-2"
                 style={{ 
                   backgroundColor: `${colors.primary}10`,
                   borderColor: colors.primary 
                 }}>
              <Clock className="w-5 h-5" style={{ color: colors.primary }} />
              <span className="text-sm" style={{ color: colors.secondary }}>
                <strong>Status:</strong> Aktiv und verfügbar
              </span>
            </div>
          </div>

          {/* Auto-redirect info */}
          <div className="p-4 rounded-xl border-2 bg-green-50 border-green-500">
            <p className="text-sm text-green-700">
              ✅ <strong>Automatische Weiterleitung:</strong> Sie werden in {countdown} Sekunden zur Hauptseite weitergeleitet.
            </p>
          </div>

          {/* Manual redirect button */}
          <button
            onClick={() => router.push('/')}
            className="mt-6 w-full p-4 rounded-xl font-medium transition-all duration-200 hover:scale-105"
            style={{ 
              backgroundColor: colors.primary,
              color: colors.background
            }}
          >
            Jetzt zur Hauptseite
          </button>

          {/* Close window option */}
          <button
            onClick={() => window.close()}
            className="mt-3 w-full p-3 rounded-xl border-2 transition-all duration-200 hover:bg-gray-50"
            style={{ 
              borderColor: colors.tertiary,
              color: colors.secondary
            }}
          >
            Fenster schließen
          </button>
        </div>
      </div>
    </div>
  );
} 