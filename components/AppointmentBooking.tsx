"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Mail, ArrowLeft } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { colors } from '@/lib/colors';
import AppointmentForm from './AppointmentForm';
import EmailVerification from './EmailVerification';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<BookingStep>('form');
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testMode, setTestMode] = useState(false); // Production mode - no test indicators
  const [tableStructure, setTableStructure] = useState<string[]>([]);
  const [productionMode, setProductionMode] = useState(false); // Enable email verification
  const [customerAction, setCustomerAction] = useState<'created' | 'updated' | null>(null);

  const handleFormSubmit = async (data: AppointmentData) => {
    setAppointmentData(data);
    
    // Always go to email verification step
    setCurrentStep('verification');
  };

  const handleVerificationComplete = async () => {
    if (!appointmentData) return;

    // Prüfe Authentifizierung nach E-Mail-Bestätigung
    if (!user) {
      setError('Bitte bestätige zuerst deine E-Mail-Adresse, um den Termin zu speichern.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create the appointment datetime by combining date and time
      console.log('=== DATE PROCESSING DEBUG ===');
      console.log('Input termin_datum:', appointmentData.termin_datum);
      console.log('Input termin_time:', appointmentData.termin_time);
      console.log('Input termin_datum type:', typeof appointmentData.termin_datum);
      console.log('Input termin_datum instanceof Date:', appointmentData.termin_datum instanceof Date);
      
      // Check if termin_datum is actually a Date object
      if (!(appointmentData.termin_datum instanceof Date)) {
        console.error('❌ termin_datum is not a Date object!');
        setError('Fehler: Ungültiges Datum. Bitte wählen Sie einen Termin aus.');
        return;
      }
      
      const appointmentDateTime = new Date(appointmentData.termin_datum);
      console.log('Created appointmentDateTime:', appointmentDateTime);
      console.log('appointmentDateTime.toISOString():', appointmentDateTime.toISOString());
      
      const [hours] = appointmentData.termin_time!.split(':').map(Number);
      console.log('Extracted hours:', hours);
      
      // Create the appointment datetime in local time to avoid timezone issues
      const year = appointmentDateTime.getFullYear();
      const month = appointmentDateTime.getMonth();
      const day = appointmentDateTime.getDate();
      
      console.log('Date components:', { year, month, day, hours });
      
      // Create the final appointment datetime in local time
      const finalAppointmentDateTime = new Date(year, month, day, hours, 0, 0, 0);
      console.log('Final appointmentDateTime (local):', finalAppointmentDateTime);
      console.log('Final appointmentDateTime.toISOString():', finalAppointmentDateTime.toISOString());
      console.log('Final appointmentDateTime.getTime():', finalAppointmentDateTime.getTime());
      console.log('Final appointmentDateTime local string:', finalAppointmentDateTime.toLocaleString('de-DE'));
      
      // Store the appointment time in local time format
      const localTimeString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hours.toString().padStart(2, '0')}:00:00`;
      console.log('Local time string to save:', localTimeString);

      // Check if customer already exists (by email)
      console.log('=== CUSTOMER CHECK DEBUG ===');
      console.log('Input email:', appointmentData.email);
      console.log('Input email type:', typeof appointmentData.email);
      console.log('Input email length:', appointmentData.email.length);
      console.log('Input email trimmed:', appointmentData.email.trim());
      console.log('Input email lowercase:', appointmentData.email.trim().toLowerCase());
      
      // First, let's check what's in the database for this email
      await checkSpecificEmail(appointmentData.email);
      
      // Try multiple email variations to find existing customer
      const emailVariations = [
        appointmentData.email.trim(),
        appointmentData.email.trim().toLowerCase(),
        appointmentData.email.trim().toUpperCase()
      ];
      
      console.log('Checking email variations:', emailVariations);
      
      let existingCustomers: any[] = [];
      let checkError: any = null;
      
      // Try each email variation
      for (const emailVariation of emailVariations) {
        const { data, error } = await supabase
          .from('kunden_projekte')
          .select('*')
          .eq('email', emailVariation)
          .order('erstellt_am', { ascending: false });
        
        if (error) {
          console.error(`Error checking email variation "${emailVariation}":`, error);
          checkError = error;
          continue;
        }
        
        if (data && data.length > 0) {
          console.log(`Found ${data.length} customers with email "${emailVariation}"`);
          existingCustomers = data;
          break;
        }
      }

      console.log('Database query result:', { existingCustomers, checkError });
      console.log('Number of existing customers found:', existingCustomers?.length || 0);
      
      if (existingCustomers && existingCustomers.length > 0) {
        console.log('All found customers with this email:');
        existingCustomers.forEach((customer, index) => {
          console.log(`${index + 1}. ID: ${customer.id}, Email: "${customer.email}", Created: ${customer.erstellt_am}, Termin: ${customer.termin_datum}`);
        });
      }

      if (checkError) {
        console.error('Error checking existing customer:', checkError);
        setError('Fehler beim Überprüfen der Kundendaten. Bitte versuchen Sie es erneut.');
        return;
      }

      const existingCustomer = existingCustomers && existingCustomers.length > 0 ? existingCustomers[0] : null;

      if (existingCustomer) {
        console.log('✅ Existing customer found:', existingCustomer);
        console.log('Will UPDATE existing customer with ID:', existingCustomer.id);
        
        // Warn if there are multiple entries with the same email
        if (existingCustomers.length > 1) {
          console.warn(`⚠️ Found ${existingCustomers.length} entries with email ${appointmentData.email}. Using the most recent one.`);
        }
      } else {
        console.log('❌ No existing customer found - will CREATE new');
      }

      const appointmentDataToSave = {
        email: appointmentData.email,
        beschreibung: `${appointmentData.beschreibung}\n\nTermin: ${formatAppointmentDate(appointmentData.termin_datum!, appointmentData.termin_time!)}\n\nKontakt: ${appointmentData.name} (${appointmentData.telefon})\nFirma: ${appointmentData.firma}`,
        termin_datum: localTimeString, // Store in local time format
        ansprechpartner_name: appointmentData.name,
        telefon: appointmentData.telefon,
        firma: appointmentData.firma,
        berater: 'Webklar Team',
        zielgruppe: 'Terminanfrage'
      };

      let result;

      if (existingCustomer) {
        // Use upsert to ensure we update the existing customer
        console.log('🔄 Starting UPSERT operation for customer ID:', existingCustomer.id);
        
        const newDescription = `${existingCustomer.beschreibung || ''}\n\n--- NEUER TERMIN ---\n${appointmentDataToSave.beschreibung}`;
        
        console.log('New description:', newDescription);
        
        // Use upsert with the existing ID to force update
        const { data: upsertData, error: upsertError } = await supabase
          .from('kunden_projekte')
          .upsert({
            id: existingCustomer.id, // Use existing ID to force update
            ...appointmentDataToSave,
            beschreibung: newDescription,
            erstellt_am: new Date().toISOString()
          }, {
            onConflict: 'id' // Update on ID conflict
          })
          .select('*');
        
        if (upsertError) {
          console.error('❌ Error upserting customer:', upsertError);
          setError('Fehler beim Aktualisieren der Kundendaten. Bitte versuchen Sie es erneut.');
          return;
        }
        
        if (!upsertData || upsertData.length === 0) {
          console.error('❌ Upsert operation returned no data');
          setError('Fehler beim Aktualisieren der Kundendaten. Bitte versuchen Sie es erneut.');
          return;
        }
        
        result = upsertData[0];
        console.log('✅ Customer updated via upsert:', result);
        
        // Verify the update by fetching the customer again
        const { data: verifyData, error: verifyError } = await supabase
          .from('kunden_projekte')
          .select('*')
          .eq('id', existingCustomer.id)
          .single();
        
        if (verifyError) {
          console.warn('⚠️ Could not verify update:', verifyError);
        } else {
          console.log('✅ Update verified - customer data:', verifyData);
        }
        
        setCustomerAction('updated');
      } else {
        // Create new customer record ONLY if no existing customer found
        console.log('🆕 Starting CREATE operation for new customer');
        console.log('Create data:', appointmentDataToSave);
        
        const { data, error } = await supabase
          .from('kunden_projekte')
          .insert(appointmentDataToSave)
          .select('*');

        if (error) {
          console.error('❌ Error creating customer:', error);
          setError('Fehler beim Erstellen der Kundendaten. Bitte versuchen Sie es erneut.');
          return;
        }

        if (!data || data.length === 0) {
          console.error('❌ Create operation returned no data');
          setError('Fehler beim Erstellen der Kundendaten. Bitte versuchen Sie es erneut.');
          return;
        }

        result = data[0]; // Get the first (and only) created record
        console.log('✅ Customer created successfully:', result);
        setCustomerAction('created');
      }

      setCurrentStep('success');
    } catch (err) {
      console.error('Unexpected error saving appointment:', err);
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
    setCustomerAction(null);
  };

  const testDatabaseConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test basic connection and get table structure
      const { data, error } = await supabase
        .from('kunden_projekte')
        .select('*')
        .limit(1);
      
      if (error) {
        console.error('Database connection test failed:', error);
        setError(`Datenbank-Verbindung fehlgeschlagen: ${error.message}`);
        return;
      }
      
      console.log('Database connection successful:', data);
      const columns = Object.keys(data[0] || {});
      console.log('Table structure:', columns);
      setTableStructure(columns);
      
      // Analyze which columns we can use
      const availableColumns = {
        email: columns.includes('email'),
        description: columns.includes('description') || columns.includes('beschreibung'),
        termin_datum: columns.includes('termin_datum'),
        name: columns.includes('name') || columns.includes('ansprechpartn'),
        phone: columns.includes('phone') || columns.includes('telefon'),
        company: columns.includes('company') || columns.includes('firma')
      };
      
      console.log('Available columns for appointment:', availableColumns);
      
      let statusMessage = '✅ Datenbank-Verbindung erfolgreich!\n\n';
      statusMessage += '📋 Verfügbare Spalten:\n';
      Object.entries(availableColumns).forEach(([key, available]) => {
        statusMessage += `${available ? '✅' : '❌'} ${key}\n`;
      });
      
      setError(statusMessage);
      
    } catch (err) {
      console.error('Connection test error:', err);
      setError('❌ Datenbank-Verbindung fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  const cleanupDuplicateCustomers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Find all customers with duplicate emails
      const { data: allCustomers, error } = await supabase
        .from('kunden_projekte')
        .select('*')
        .order('erstellt_am', { ascending: true });
      
      if (error) {
        console.error('Error fetching customers:', error);
        setError('Fehler beim Laden der Kundendaten.');
        return;
      }
      
      // Group by email
      const emailGroups: { [email: string]: any[] } = {};
      allCustomers?.forEach(customer => {
        if (!emailGroups[customer.email]) {
          emailGroups[customer.email] = [];
        }
        emailGroups[customer.email].push(customer);
      });
      
      // Find duplicates
      const duplicates = Object.entries(emailGroups)
        .filter(([email, customers]) => customers.length > 1)
        .map(([email, customers]) => ({ email, customers }));
      
      console.log('Found duplicate customers:', duplicates);
      
      if (duplicates.length === 0) {
        setError('✅ Keine Duplikate gefunden!');
        return;
      }
      
      let statusMessage = `🔍 ${duplicates.length} E-Mail-Adressen mit Duplikaten gefunden:\n\n`;
      
      duplicates.forEach(({ email, customers }) => {
        statusMessage += `📧 ${email}: ${customers.length} Einträge\n`;
        customers.forEach((customer, index) => {
          statusMessage += `  ${index + 1}. ID: ${customer.id} (${customer.erstellt_am})\n`;
        });
        statusMessage += '\n';
      });
      
      statusMessage += '💡 Tipp: Der neueste Eintrag wird für neue Termine verwendet.';
      
      setError(statusMessage);
      
    } catch (err) {
      console.error('Cleanup error:', err);
      setError('Fehler beim Bereinigen der Duplikate.');
    } finally {
      setLoading(false);
    }
  };

  const checkSpecificEmail = async (email: string) => {
    console.log('🔍 Checking specific email:', email);
    
    const { data, error } = await supabase
      .from('kunden_projekte')
      .select('*')
      .eq('email', email)
      .order('erstellt_am', { ascending: false });
    
    if (error) {
      console.error('Error checking email:', error);
      return;
    }
    
    console.log(`Found ${data?.length || 0} entries for email "${email}":`);
    data?.forEach((entry, index) => {
      console.log(`${index + 1}. ID: ${entry.id}, Email: "${entry.email}", Created: ${entry.erstellt_am}`);
    });
    
    return data;
  };

  const formatAppointmentDate = (date: Date, time: string) => {
    return new Intl.DateTimeFormat('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date) + ` um ${time} Uhr`;
  };

  const cleanupIncorrectDates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🧹 Cleaning up incorrect appointment dates...');
      
      // Find all entries with the incorrect date "2025-07-21 07:00:00"
      const { data: incorrectEntries, error: findError } = await supabase
        .from('kunden_projekte')
        .select('*')
        .eq('termin_datum', '2025-07-21T07:00:00.000Z');
      
      if (findError) {
        console.error('Error finding incorrect entries:', findError);
        setError('Fehler beim Finden der fehlerhaften Einträge.');
        return;
      }
      
      console.log(`Found ${incorrectEntries?.length || 0} entries with incorrect date`);
      
      if (incorrectEntries && incorrectEntries.length > 0) {
        // Update all incorrect entries to remove the termin_datum
        const { error: updateError } = await supabase
          .from('kunden_projekte')
          .update({ termin_datum: null })
          .eq('termin_datum', '2025-07-21T07:00:00.000Z');
        
        if (updateError) {
          console.error('Error updating incorrect entries:', updateError);
          setError('Fehler beim Bereinigen der fehlerhaften Einträge.');
          return;
        }
        
        console.log('✅ Successfully cleaned up incorrect appointment dates');
        alert(`✅ ${incorrectEntries.length} fehlerhafte Termine wurden bereinigt!`);
      } else {
        console.log('No incorrect entries found');
        alert('✅ Keine fehlerhaften Termine gefunden!');
      }
      
    } catch (err) {
      console.error('Unexpected error cleaning up dates:', err);
      setError('Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Production Mode Indicator */}
      {productionMode && (
        <div className="mb-4 p-3 rounded-xl border-2 border-green-500 bg-green-50">
          <p className="text-sm text-green-700">
            ✅ <strong>Terminbuchung aktiv:</strong> Ihre Termine werden direkt in unserem System gespeichert.
          </p>
          <div className="mt-2 flex space-x-2">
            <Button 
              onClick={testDatabaseConnection}
              disabled={loading}
              className="text-xs"
              variant="outline"
              size="sm"
            >
              {loading ? 'Teste...' : '🔍 DB-Verbindung testen'}
            </Button>
            <Button 
              onClick={cleanupDuplicateCustomers}
              disabled={loading}
              className="text-xs"
              variant="outline"
              size="sm"
            >
              {loading ? 'Prüfe...' : '🔍 Duplikate prüfen'}
            </Button>
            <Button 
              onClick={cleanupIncorrectDates}
              disabled={loading}
              className="text-xs"
              variant="outline"
              size="sm"
            >
              {loading ? 'Bereinige...' : '🧹 Fehlerhafte Termine bereinigen'}
            </Button>
          </div>
        </div>
      )}

      {/* Enhanced Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-2 sm:space-x-4">
          {/* Step 1 */}
          <div className={`flex flex-col items-center space-y-2 ${
            currentStep === 'form' ? 'text-primary' : 
            currentStep === 'verification' || currentStep === 'success' ? 'text-primary' : 'text-gray-400'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              currentStep === 'form' 
                ? 'bg-primary text-white shadow-lg scale-110' 
                : currentStep === 'verification' || currentStep === 'success'
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-gray-200 text-gray-500'
            }`}>
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-center">Termin auswählen</span>
          </div>
          
          {/* Connector 1 */}
          <div className={`w-8 sm:w-12 h-1 rounded-full transition-all duration-300 ${
            currentStep === 'verification' || currentStep === 'success' 
              ? 'bg-primary' 
              : 'bg-gray-200'
          }`}></div>
          
          {/* Step 2 */}
          <div className={`flex flex-col items-center space-y-2 ${
            currentStep === 'verification' || currentStep === 'success' 
              ? 'text-primary' 
              : 'text-gray-400'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              currentStep === 'verification' 
                ? 'bg-primary text-white shadow-lg scale-110' 
                : currentStep === 'success'
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-gray-200 text-gray-500'
            }`}>
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-center">E-Mail bestätigen</span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 rounded-xl border-2 border-red-500 bg-red-50">
          <pre className="text-red-600 text-sm whitespace-pre-wrap">{error}</pre>
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
                {customerAction === 'created' 
                  ? 'Vielen Dank für Ihre erste Terminanfrage! Ihr Kundenprofil wurde erstellt.'
                  : 'Vielen Dank für Ihre weitere Terminanfrage! Ihr bestehendes Kundenprofil wurde aktualisiert.'
                }
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
              Vielen Dank für Ihre Terminanfrage! Wir werden uns in Kürze bei Ihnen melden, um den Termin zu bestätigen.
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