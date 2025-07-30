"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { supabase } from '@/lib/supabase';
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
  const [rateLimited, setRateLimited] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  const handleSendVerification = async () => {
    if (!verificationEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(verificationEmail)) {
      setError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }

    if (rateLimited) {
      setError(`Rate Limit aktiv. Bitte warten Sie ${cooldownTime} Sekunden oder verwenden Sie die manuelle Bestätigung.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('=== E-MAIL VERIFICATION DEBUG ===');
      console.log('Sending verification email to:', verificationEmail);
      console.log('Current origin:', window.location.origin);
      console.log('Redirect URL:', `${window.location.origin}/auth/callback`);
      
      // Use signInWithOtp with proper configuration for email verification
      const { data, error } = await supabase.auth.signInWithOtp({
        email: verificationEmail,
        options: {
          shouldCreateUser: true,
          data: {
            // Custom metadata for appointment booking
            appointment_booking: true,
            email: verificationEmail
          }
        }
      });

      console.log('Supabase email verification response:', { data, error });

      if (error) {
        console.error('Supabase email verification error:', error);
        
        if (error.message.includes('rate limit')) {
          setRateLimited(true);
          setCooldownTime(60); // 60 seconds cooldown
          
          // Start countdown
          const countdown = setInterval(() => {
            setCooldownTime(prev => {
              if (prev <= 1) {
                clearInterval(countdown);
                setRateLimited(false);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
          setError(`E-Mail-Rate-Limit erreicht. Bitte warten Sie 60 Sekunden oder verwenden Sie die manuelle Bestätigung.`);
        } else if (error.message.includes('expired') || error.message.includes('invalid')) {
          setError('Der E-Mail-Link ist abgelaufen oder ungültig. Bitte fordern Sie einen neuen Link an.');
        } else {
          setError(`E-Mail-Fehler: ${error.message}`);
        }
      } else {
        console.log('Verification email sent successfully');
        setSent(true);
      }
    } catch (err) {
      console.error('Unexpected error sending verification email:', err);
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
            E-Mail senden
          </h3>
        </div>
        
        {!sent ? (
          <div className="space-y-6">
            <p className="text-sm" style={{ color: colors.secondary }}>
              Um Ihren Termin zu bestätigen, senden wir Ihnen eine Bestätigungs-E-Mail. 
              Klicken Sie auf den Link in der E-Mail, um sich zu authentifizieren.
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
              
              {rateLimited && (
                <div className="mt-2 p-2 rounded-lg border-2 border-orange-300 bg-orange-50">
                  <p className="text-xs text-orange-700">
                    ⚠️ <strong>Rate Limit aktiv:</strong> Bitte warten Sie {cooldownTime} Sekunden oder verwenden Sie die manuelle Bestätigung.
                  </p>
                </div>
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
                disabled={loading || rateLimited}
                className="flex-1 rounded-xl flex items-center justify-center space-x-2"
                style={{ 
                  backgroundColor: colors.primary,
                  color: colors.background
                }}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>E-Mail wird gesendet...</span>
                  </>
                ) : rateLimited ? (
                  <>
                    <span>Rate Limit ({cooldownTime}s)</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>E-Mail senden</span>
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
                Wir haben eine Bestätigungs-E-Mail an <strong>{verificationEmail}</strong> gesendet. 
                Bitte überprüfen Sie Ihren Posteingang und klicken Sie auf den Link in der E-Mail.
              </p>

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