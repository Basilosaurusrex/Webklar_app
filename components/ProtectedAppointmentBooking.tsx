"use client"

import { useAuth } from '@/hooks/useAuth'
import AppointmentBooking from './AppointmentBooking'
import MagicLinkAuth from './MagicLinkAuth'
import { colors } from '@/lib/colors'
import { User, Shield, Info } from 'lucide-react'

export default function ProtectedAppointmentBooking() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div 
          className="p-6 sm:p-8 rounded-3xl shadow-lg backdrop-blur-sm text-center"
          style={{ backgroundColor: `${colors.background}F0` }}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" 
               style={{ borderColor: colors.primary }}></div>
          <p style={{ color: colors.secondary }}>Lade...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Appointment Booking */}
      <AppointmentBooking />
    </div>
  )
} 