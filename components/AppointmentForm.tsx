"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Mail, Calendar, User, Phone, Building, MessageSquare } from "lucide-react";
import { colors } from '@/lib/colors';
import AppointmentCalendar from './AppointmentCalendar';

interface AppointmentFormData {
  name: string;
  telefon: string;
  firma: string;
  email: string;
  beschreibung: string;
}

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormData & { termin_datum?: Date; termin_time?: string }) => void;
  loading?: boolean;
}

export default function AppointmentForm({ onSubmit, loading = false }: AppointmentFormProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    name: '',
    telefon: '',
    firma: '',
    email: '',
    beschreibung: ''
  });
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; time: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof AppointmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSlotSelect = (date: Date, time: string) => {
    console.log('=== SLOT SELECTION DEBUG ===');
    console.log('Selected date:', date);
    console.log('Selected time:', time);
    console.log('Date type:', typeof date);
    console.log('Date instanceof Date:', date instanceof Date);
    console.log('Date.toISOString():', date.toISOString());
    
    if (time === '') {
      setSelectedSlot(null);
      console.log('Slot deselected');
    } else {
      setSelectedSlot({ date, time });
      console.log('Slot selected:', { date, time });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name ist erforderlich';
    }

    if (!formData.telefon.trim()) {
      newErrors.telefon = 'Telefonnummer ist erforderlich';
    }

    if (!formData.firma.trim()) {
      newErrors.firma = 'Unternehmen ist erforderlich';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
    }

    if (!formData.beschreibung.trim()) {
      newErrors.beschreibung = 'Projektbeschreibung ist erforderlich';
    }

    if (!selectedSlot) {
      newErrors.termin_datum = 'Bitte wählen Sie einen Termin aus';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('=== FORM SUBMIT DEBUG ===');
      console.log('Form data:', formData);
      console.log('Selected slot:', selectedSlot);
      console.log('Selected slot date:', selectedSlot?.date);
      console.log('Selected slot time:', selectedSlot?.time);
      
      const submitData = {
        ...formData,
        termin_datum: selectedSlot?.date,
        termin_time: selectedSlot?.time
      };
      
      console.log('Submit data:', submitData);
      console.log('Submit termin_datum:', submitData.termin_datum);
      console.log('Submit termin_time:', submitData.termin_time);
      
      onSubmit(submitData);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appointment Form */}
        <div 
          className="p-6 sm:p-8 rounded-3xl shadow-lg backdrop-blur-sm"
          style={{ backgroundColor: `${colors.background}F0` }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Calendar className="w-6 h-6" style={{ color: colors.primary }} />
            <h3 className="text-xl font-bold" style={{ color: colors.primary }}>
              Termin anfragen
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center space-x-2" 
                     style={{ color: colors.primary }}>
                <User className="w-4 h-4" />
                <span>01 – Wie ist dein Name?</span>
              </label>
              <Input 
                type="text" 
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full p-3 rounded-xl border-2 focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-red-500' : ''
                }`}
                style={{ 
                  borderColor: errors.name ? '#ef4444' : colors.tertiary,
                  backgroundColor: colors.background,
                  color: colors.primary
                }}
                placeholder="Dein vollständiger Name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center space-x-2" 
                     style={{ color: colors.primary }}>
                <Phone className="w-4 h-4" />
                <span>02 – Deine Telefonnummer</span>
              </label>
              <Input 
                type="tel" 
                value={formData.telefon}
                onChange={(e) => handleInputChange('telefon', e.target.value)}
                className={`w-full p-3 rounded-xl border-2 focus:outline-none focus:ring-2 ${
                  errors.telefon ? 'border-red-500' : ''
                }`}
                style={{ 
                  borderColor: errors.telefon ? '#ef4444' : colors.tertiary,
                  backgroundColor: colors.background,
                  color: colors.primary
                }}
                placeholder="+49 123 456789"
              />
              {errors.telefon && (
                <p className="text-red-500 text-sm mt-1">{errors.telefon}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center space-x-2" 
                     style={{ color: colors.primary }}>
                <Building className="w-4 h-4" />
                <span>03 – Dein Unternehmen</span>
              </label>
              <Input 
                type="text" 
                value={formData.firma}
                onChange={(e) => handleInputChange('firma', e.target.value)}
                className={`w-full p-3 rounded-xl border-2 focus:outline-none focus:ring-2 ${
                  errors.firma ? 'border-red-500' : ''
                }`}
                style={{ 
                  borderColor: errors.firma ? '#ef4444' : colors.tertiary,
                  backgroundColor: colors.background,
                  color: colors.primary
                }}
                placeholder="Name deines Unternehmens"
              />
              {errors.firma && (
                <p className="text-red-500 text-sm mt-1">{errors.firma}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center space-x-2" 
                     style={{ color: colors.primary }}>
                <Mail className="w-4 h-4" />
                <span>04 – Deine E-Mail-Adresse</span>
              </label>
              <Input 
                type="email" 
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full p-3 rounded-xl border-2 focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-500' : ''
                }`}
                style={{ 
                  borderColor: errors.email ? '#ef4444' : colors.tertiary,
                  backgroundColor: colors.background,
                  color: colors.primary
                }}
                placeholder="deine@email.de"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center space-x-2" 
                     style={{ color: colors.primary }}>
                <MessageSquare className="w-4 h-4" />
                <span>05 – Erzähl uns kurz von deinem Vorhaben</span>
              </label>
              <Textarea 
                value={formData.beschreibung}
                onChange={(e) => handleInputChange('beschreibung', e.target.value)}
                rows={4}
                className={`w-full p-3 rounded-xl border-2 focus:outline-none focus:ring-2 ${
                  errors.beschreibung ? 'border-red-500' : ''
                }`}
                style={{ 
                  borderColor: errors.beschreibung ? '#ef4444' : colors.tertiary,
                  backgroundColor: colors.background,
                  color: colors.primary
                }}
                placeholder="Beschreibe dein Projekt, Ziele, Wünsche..."
              />
              {errors.beschreibung && (
                <p className="text-red-500 text-sm mt-1">{errors.beschreibung}</p>
              )}
            </div>

            {errors.termin_datum && (
              <div className="p-3 rounded-xl border-2 border-red-500 bg-red-50">
                <p className="text-red-500 text-sm">{errors.termin_datum}</p>
              </div>
            )}
            
            <Button 
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-lg font-semibold flex items-center justify-center space-x-2"
              style={{ 
                backgroundColor: colors.primary,
                color: colors.background
              }}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Wird verarbeitet...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Termin anfragen</span>
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Calendar Component */}
        <div className="flex flex-col space-y-6">
          <AppointmentCalendar 
            onSlotSelect={handleSlotSelect}
            selectedSlot={selectedSlot}
          />

          {/* Alternative Contact */}
          <div 
            className="p-6 rounded-2xl backdrop-blur-sm"
            style={{ backgroundColor: `${colors.primary}20` }}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2" 
                style={{ color: colors.background }}>
              <Phone className="w-5 h-5" />
              <span>Oder direkt anrufen</span>
            </h3>
            
            <div className="space-y-3 text-sm" style={{ color: colors.background }}>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-3" />
                <span>+49 (0) 631 123 456</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3" />
                <span>hallo@webklar.de</span>
              </div>
              <div className="flex items-center">
                <Building className="w-4 h-4 mr-3" />
                <span>Kaiserslautern, Deutschland</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 