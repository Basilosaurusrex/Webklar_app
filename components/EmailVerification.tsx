"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { supabase } from '@/lib/supabaseClient';
import { colors } from '@/lib/colors';

interface EmailVerificationProps {
  email: string;
  onVerificationComplete: () => void;
  onBack: () => void;
}

export default function EmailVerification({ email, onVerificationComplete, onBack }: EmailVerificationProps) {
  const [verificationEmail, setVerificationEmail] = useState(email);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSendVerification = async () => {
    if (!verificationEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(verificationEmail)) {
      setError('Bitte geben Sie eine gültige E-Mail-Adresse ein');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: verificationEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`,
          data: {
            // Custom metadata for appointment booking
            appointment_booking: true
          }
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setSent(true);
      }
    } catch (err) {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationEmail(e.target.value);
    if (error) setError(null);
  };

  const handleResend = () => {
    setSent(false);
    setError(null);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        className="p-6 sm:p-8 rounded-3xl shadow-lg backdrop-blur-sm"
        style={{ backgroundColor: `${colors.background}F0` }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <Mail className="w-6 h-6" style={{ color: colors.primary }} />
          <h3 className="text-xl font-bold" style={{ color: colors.primary }}>
            E-Mail bestätigen
          </h3>
        </div>

        {!sent ? (
          <div className="space-y-6">
            <p className="text-sm" style={{ color: colors.secondary }}>
              Um Ihren Termin zu bestätigen, müssen wir Ihre E-Mail-Adresse verifizieren. 
              Sie erhalten einen Magic Link per E-Mail.
            </p>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.primary }}>
                E-Mail-Adresse
              </label>
              <Input 
                type="email" 
                value={verificationEmail}
                onChange={handleEmailChange}
                className="w-full p-3 rounded-xl border-2 focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: error ? '#ef4444' : colors.tertiary,
                  backgroundColor: colors.background,
                  color: colors.primary
                }}
                placeholder="ihre@email.de"
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={onBack}
                variant="outline"
                className="flex-1 rounded-xl"
                style={{ 
                  borderColor: colors.tertiary,
                  color: colors.primary
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück
              </Button>
              
              <Button 
                onClick={handleSendVerification}
                disabled={loading}
                className="flex-1 rounded-xl flex items-center justify-center space-x-2"
                style={{ 
                  backgroundColor: colors.primary,
                  color: colors.background
                }}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Wird gesendet...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Verifizierung senden</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                   style={{ backgroundColor: `${colors.primary}20` }}>
                <Mail className="w-8 h-8" style={{ color: colors.primary }} />
              </div>
              
              <h4 className="text-lg font-semibold mb-2" style={{ color: colors.primary }}>
                E-Mail gesendet!
              </h4>
              
              <p className="text-sm mb-4" style={{ color: colors.secondary }}>
                Wir haben eine Verifizierungs-E-Mail an <strong>{verificationEmail}</strong> gesendet. 
                Bitte überprüfen Sie Ihren Posteingang und klicken Sie auf den Magic Link.
              </p>

              <div className="p-4 rounded-xl border-2" 
                   style={{ 
                     backgroundColor: `${colors.primary}10`,
                     borderColor: colors.primary 
                   }}>
                <p className="text-xs" style={{ color: colors.secondary }}>
                  <strong>Tipp:</strong> Schauen Sie auch in Ihrem Spam-Ordner nach, 
                  falls Sie die E-Mail nicht finden.
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={handleResend}
                variant="outline"
                className="flex-1 rounded-xl"
                style={{ 
                  borderColor: colors.tertiary,
                  color: colors.primary
                }}
              >
                Erneut senden
              </Button>
              
              <Button 
                onClick={onVerificationComplete}
                className="flex-1 rounded-xl flex items-center justify-center space-x-2"
                style={{ 
                  backgroundColor: colors.primary,
                  color: colors.background
                }}
              >
                <CheckCircle className="w-4 h-4" />
                <span>E-Mail bestätigt</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 