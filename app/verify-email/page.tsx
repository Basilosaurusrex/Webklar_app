"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { supabase } from '@/lib/supabaseClient';
import { colors } from '@/lib/colors';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get the session from the URL parameters
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setVerificationStatus('error');
          setErrorMessage('Fehler bei der E-Mail-Verifizierung. Bitte versuchen Sie es erneut.');
          return;
        }

        if (data.session) {
          // User is authenticated, verification was successful
          setVerificationStatus('success');
          
          // Redirect back to the main page after a short delay
          setTimeout(() => {
            router.push('/#contact');
          }, 3000);
        } else {
          // No session found, verification might have failed
          setVerificationStatus('error');
          setErrorMessage('E-Mail-Verifizierung fehlgeschlagen. Bitte überprüfen Sie den Link und versuchen Sie es erneut.');
        }
      } catch (err) {
        console.error('Error during email verification:', err);
        setVerificationStatus('error');
        setErrorMessage('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      }
    };

    handleEmailVerification();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div 
          className="p-8 rounded-3xl shadow-lg backdrop-blur-sm text-center"
          style={{ backgroundColor: `${colors.background}F0` }}
        >
          {verificationStatus === 'loading' && (
            <>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                   style={{ backgroundColor: `${colors.primary}20` }}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" 
                     style={{ borderColor: colors.primary }}></div>
              </div>
              
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>
                E-Mail wird verifiziert...
              </h2>
              
              <p className="text-sm" style={{ color: colors.secondary }}>
                Bitte warten Sie einen Moment, während wir Ihre E-Mail-Adresse bestätigen.
              </p>
            </>
          )}

          {verificationStatus === 'success' && (
            <>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                   style={{ backgroundColor: `${colors.primary}20` }}>
                <CheckCircle className="w-8 h-8" style={{ color: colors.primary }} />
              </div>
              
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>
                E-Mail erfolgreich verifiziert!
              </h2>
              
              <p className="text-sm mb-6" style={{ color: colors.secondary }}>
                Vielen Dank! Ihre E-Mail-Adresse wurde erfolgreich bestätigt. 
                Ihr Termin wird nun in unserem System gespeichert.
              </p>
              
              <div className="p-4 rounded-xl border-2 mb-6" 
                   style={{ 
                     backgroundColor: `${colors.primary}10`,
                     borderColor: colors.primary 
                   }}>
                <p className="text-xs" style={{ color: colors.secondary }}>
                  Sie werden automatisch zur Hauptseite weitergeleitet...
                </p>
              </div>
              
              <Button 
                onClick={() => router.push('/#contact')}
                className="w-full rounded-xl flex items-center justify-center space-x-2"
                style={{ 
                  backgroundColor: colors.primary,
                  color: colors.background
                }}
              >
                <span>Zurück zur Hauptseite</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {verificationStatus === 'error' && (
            <>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                   style={{ backgroundColor: '#fef2f2' }}>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>
                Verifizierung fehlgeschlagen
              </h2>
              
              <p className="text-sm mb-6" style={{ color: colors.secondary }}>
                {errorMessage}
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push('/#contact')}
                  className="w-full rounded-xl"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: colors.background
                  }}
                >
                  Zurück zur Terminbuchung
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full rounded-xl"
                  style={{ 
                    borderColor: colors.tertiary,
                    color: colors.primary
                  }}
                  onClick={() => window.location.reload()}
                >
                  Erneut versuchen
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 