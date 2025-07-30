"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Mail } from "lucide-react";
import { colors } from '@/lib/colors';

export default function SuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => {
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

  const handleContinue = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
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
            E-Mail erfolgreich bestätigt!
          </h1>

          <p className="text-lg mb-6" style={{ color: colors.secondary }}>
            Ihre E-Mail-Adresse wurde erfolgreich verifiziert. 
            Ihr Termin ist jetzt bestätigt.
          </p>

          {/* Additional Info */}
          <div className="p-4 rounded-xl border-2 mb-6" 
               style={{ 
                 backgroundColor: `${colors.primary}10`,
                 borderColor: colors.primary 
               }}>
            <div className="flex items-center space-x-2 mb-2">
              <Mail className="w-5 h-5" style={{ color: colors.primary }} />
              <span className="text-sm font-semibold" style={{ color: colors.primary }}>
                Automatische Bestätigung
              </span>
            </div>
            <p className="text-xs" style={{ color: colors.secondary }}>
              Sie wurden automatisch angemeldet und Ihr Termin wurde bestätigt. 
              Keine weiteren Schritte erforderlich.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleContinue}
              className="w-full py-3 rounded-xl text-lg font-semibold flex items-center justify-center space-x-2"
              style={{ 
                backgroundColor: colors.primary,
                color: colors.background
              }}
            >
              <ArrowRight className="w-5 h-5" />
              <span>Weiter zur Startseite</span>
            </Button>

            <p className="text-xs" style={{ color: colors.secondary }}>
              Automatische Weiterleitung in {countdown} Sekunden...
            </p>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-xs" style={{ color: colors.secondary }}>
            <p>• Sie erhalten eine Bestätigungs-E-Mail</p>
            <p>• Unser Team wird sich bald bei Ihnen melden</p>
            <p>• Vielen Dank für Ihr Vertrauen!</p>
          </div>
        </div>
      </div>
    </div>
  );
} 