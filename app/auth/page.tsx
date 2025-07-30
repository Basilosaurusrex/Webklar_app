"use client";

import { useSearchParams } from 'next/navigation'
import EmailAuth from '@/components/MagicLinkAuth'
import { AlertCircle } from 'lucide-react'
import { colors } from '@/lib/colors'

export default function AuthPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 rounded-xl border-2 border-red-500 bg-red-50">
            <div className="flex items-center space-x-3 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-700">
                Authentifizierungsfehler
              </h3>
            </div>
            <p className="text-sm text-red-600 mb-2">
              {errorDescription || 'Ein Fehler ist bei der Authentifizierung aufgetreten.'}
            </p>
            <div className="text-xs text-red-500">
              <p><strong>Fehler:</strong> {error}</p>
              {error === 'otp_expired' && (
                <p className="mt-2">
                  💡 <strong>Tipp:</strong> Der E-Mail-Link ist abgelaufen. Bitte fordern Sie einen neuen Link an.
                </p>
              )}
            </div>
          </div>
        )}

        <EmailAuth />
      </div>
    </div>
  )
} 