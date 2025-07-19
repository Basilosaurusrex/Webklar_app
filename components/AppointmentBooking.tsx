"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Mail, ArrowLeft } from "lucide-react";
import { supabase } from '@/lib/supabaseClient';
import { colors } from '@/lib/colors';
import AppointmentForm from './AppointmentForm';
import EmailVerification from './EmailVerification';

type BookingStep = 'form' | 'verification' | 'success';

interface AppointmentData {
  name: string;
  telefon: string;
  firma: string;
  email: string;
  beschreibung: string;
  termin_datum?: Date;
  termin_time?: string;
}

export default function AppointmentBooking() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('form');
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testMode, setTestMode] = useState(true); // Test mode for development

  const handleFormSubmit = async (data: AppointmentData) => {
    setAppointmentData(data);
    
    if (testMode) {
      // Skip email verification in test mode
      await handleVerificationComplete();
    } else {
      setCurrentStep('verification');
    }
  };

  const handleVerificationComplete = async () => {
    if (!appointmentData) return;

    setLoading(true);
    setError(null);

    try {
      // Create the appointment datetime by combining date and time
      const appointmentDateTime = new Date(appointmentData.termin_datum!);
      const [hours] = appointmentData.termin_time!.split(':').map(Number);
      appointmentDateTime.setHours(hours, 0, 0, 0);

      // Insert the appointment into the database
      const { error } = await supabase
        .from('kunden_projekte')
        .insert({
          ansprechpartn: appointmentData.name,
          telefon: appointmentData.telefon,
          firma: appointmentData.firma,
          email: appointmentData.email,
          beschreibung: appointmentData.beschreibung,
          termin_datum: appointmentDateTime.toISOString(),
          // Set default values for other required fields
          berater: 'Webklar Team',
          zielgruppe: 'Terminanfrage',
          website_vorha: false,
          texte_bilder_v: false,
          logo_farben_v: false,
          selbst_pflegen: false,
          laufende_betre: false
        });

      if (error) {
        console.error('Error saving appointment:', error);
        setError('Fehler beim Speichern des Termins. Bitte versuchen Sie es erneut.');
        return;
      }

      setCurrentStep('success');
    } catch (err) {
      console.error('Error saving appointment:', err);
      setError('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep('form');
    setError(null);
  };

  const handleReset = () => {
    setCurrentStep('form');
    setAppointmentData(null);
    setError(null);
    setLoading(false);
  };

  const formatAppointmentDate = (date: Date, time: string) => {
    return new Intl.DateTimeFormat('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date) + ` um ${time} Uhr`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Test Mode Indicator */}
      {testMode && (
        <div className="mb-4 p-3 rounded-xl border-2 border-yellow-500 bg-yellow-50">
          <p className="text-sm text-yellow-700">
            🧪 <strong>Test-Modus aktiv:</strong> E-Mail-Verifizierung wird übersprungen für schnelles Testing.
          </p>
        </div>
      )}

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          <div className={`flex items-center space-x-2 ${
            currentStep === 'form' ? 'text-primary' : 'text-gray-400'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 'form' ? 'bg-primary text-white' : 'bg-gray-200'
            }`}>
              1
            </div>
            <span className="hidden sm:inline">Termin auswählen</span>
          </div>
          
          <div className={`w-8 h-1 rounded ${
            currentStep === 'verification' || currentStep === 'success' ? 'bg-primary' : 'bg-gray-200'
          }`}></div>
          
          <div className={`flex items-center space-x-2 ${
            currentStep === 'verification' ? 'text-primary' : currentStep === 'success' ? 'text-green-600' : 'text-gray-400'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 'verification' ? 'bg-primary text-white' : 
              currentStep === 'success' ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}>
              2
            </div>
            <span className="hidden sm:inline">E-Mail bestätigen</span>
          </div>
          
          <div className={`w-8 h-1 rounded ${
            currentStep === 'success' ? 'bg-green-600' : 'bg-gray-200'
          }`}></div>
          
          <div className={`flex items-center space-x-2 ${
            currentStep === 'success' ? 'text-green-600' : 'text-gray-400'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 'success' ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}>
              3
            </div>
            <span className="hidden sm:inline">Bestätigt</span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 rounded-xl border-2 border-red-500 bg-red-50">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Step Content */}
      {currentStep === 'form' && (
        <AppointmentForm 
          onSubmit={handleFormSubmit}
          loading={loading}
        />
      )}

      {currentStep === 'verification' && appointmentData && (
        <EmailVerification 
          email={appointmentData.email}
          onVerificationComplete={handleVerificationComplete}
          onBack={handleBack}
        />
      )}

      {currentStep === 'success' && appointmentData && (
        <div className="w-full max-w-md mx-auto">
          <div 
            className="p-6 sm:p-8 rounded-3xl shadow-lg backdrop-blur-sm text-center"
            style={{ backgroundColor: `${colors.background}F0` }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                 style={{ backgroundColor: `${colors.primary}20` }}>
              <CheckCircle className="w-8 h-8" style={{ color: colors.primary }} />
            </div>
            
            <h3 className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>
              Termin bestätigt!
            </h3>
            
            <div className="space-y-4 mb-6">
              <p className="text-sm" style={{ color: colors.secondary }}>
                Vielen Dank für Ihre Terminanfrage. Ihr Termin wurde erfolgreich gebucht.
              </p>
              
              <div className="p-4 rounded-xl border-2" 
                   style={{ 
                     backgroundColor: `${colors.primary}10`,
                     borderColor: colors.primary 
                   }}>
                <p className="font-semibold mb-2" style={{ color: colors.primary }}>
                  Ihr Termin:
                </p>
                <p className="text-sm" style={{ color: colors.secondary }}>
                  {formatAppointmentDate(appointmentData.termin_datum!, appointmentData.termin_time!)}
                </p>
              </div>
              
              <div className="p-4 rounded-xl border-2" 
                   style={{ 
                     backgroundColor: `${colors.primary}10`,
                     borderColor: colors.primary 
                   }}>
                <p className="font-semibold mb-2" style={{ color: colors.primary }}>
                  Kontaktdaten:
                </p>
                <p className="text-sm" style={{ color: colors.secondary }}>
                  {appointmentData.name}<br />
                  {appointmentData.firma}<br />
                  {appointmentData.email}
                </p>
              </div>
            </div>
            
            <p className="text-xs mb-6" style={{ color: colors.secondary }}>
              {testMode ? 
                'Test-Modus: Termin wurde direkt gespeichert.' : 
                'Sie erhalten in Kürze eine Bestätigungs-E-Mail mit allen Details zu Ihrem Termin.'
              }
            </p>
            
            <Button 
              onClick={handleReset}
              className="w-full rounded-xl"
              style={{ 
                backgroundColor: colors.primary,
                color: colors.background
              }}
            >
              Neuen Termin buchen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 