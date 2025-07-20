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
      {/* Info Banner */}
      <div className="mb-6 p-4 rounded-xl border-2 bg-blue-50 border-blue-500">
        <div className="flex items-center space-x-3">
          <Info className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-semibold text-blue-700">
              💡 So funktioniert die Terminbuchung:
            </p>
            <p className="text-sm text-blue-600">
              1. Termin auswählen → 2. E-Mail bestätigen → 3. Termin wird gespeichert
            </p>
          </div>
        </div>
      </div>

      {/* Authentication Status (nur wenn angemeldet) */}
      {user && (
        <div className="mb-6 p-4 rounded-xl border-2 bg-green-50 border-green-500">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-700">
                ✅ E-Mail bestätigt
              </p>
              <p className="text-sm text-green-600">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Booking */}
      <AppointmentBooking />
    </div>
  )
} 