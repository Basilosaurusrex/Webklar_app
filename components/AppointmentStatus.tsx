"use client";

import { useEffect, useState } from 'react';
import { CheckCircle, Calendar, Mail, Clock, User } from "lucide-react";
import { colors } from '@/lib/colors';
import { useAuth } from '@/hooks/useAuth';

export default function AppointmentStatus() {
  const { user, loading } = useAuth();
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Show status if user is authenticated and has appointment_booking metadata
    if (user && !loading) {
      const hasAppointmentBooking = user.user_metadata?.appointment_booking;
      if (hasAppointmentBooking) {
        setShowStatus(true);
        
        // Hide status after 10 seconds
        const timer = setTimeout(() => {
          setShowStatus(false);
        }, 10000);

        return () => clearTimeout(timer);
      }
    }
  }, [user, loading]);

  if (!showStatus) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div 
        className="p-6 rounded-2xl shadow-lg backdrop-blur-sm border-2"
        style={{ 
          backgroundColor: `${colors.background}F0`,
          borderColor: colors.primary
        }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="w-6 h-6" style={{ color: colors.primary }} />
          <h3 className="font-semibold" style={{ color: colors.primary }}>
            Termin bestätigt! ✅
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <User className="w-4 h-4" style={{ color: colors.secondary }} />
            <span className="text-sm" style={{ color: colors.secondary }}>
              <strong>Status:</strong> Angemeldet
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Mail className="w-4 h-4" style={{ color: colors.secondary }} />
            <span className="text-sm" style={{ color: colors.secondary }}>
              <strong>E-Mail:</strong> {user?.email}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="w-4 h-4" style={{ color: colors.secondary }} />
            <span className="text-sm" style={{ color: colors.secondary }}>
              <strong>Termin:</strong> Gespeichert
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="w-4 h-4" style={{ color: colors.secondary }} />
            <span className="text-sm" style={{ color: colors.secondary }}>
              <strong>Zeit:</strong> {new Date().toLocaleTimeString('de-DE')}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowStatus(false)}
          className="mt-4 w-full p-2 rounded-xl text-sm transition-all duration-200 hover:scale-105"
          style={{ 
            backgroundColor: colors.primary,
            color: colors.background
          }}
        >
          Verstanden
        </button>
      </div>
    </div>
  );
} 