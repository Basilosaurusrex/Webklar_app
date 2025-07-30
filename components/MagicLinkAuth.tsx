import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { colors } from '@/lib/colors'
import { Mail, CheckCircle } from 'lucide-react'

export default function EmailAuth() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        setMessage(`Fehler: ${error.message}`)
        setMessageType('error')
      } else {
        setMessage('E-Mail wurde an deine E-Mail-Adresse gesendet! Bitte prüfe dein Postfach.')
        setMessageType('success')
      }
    } catch (error) {
      setMessage('Ein unerwarteter Fehler ist aufgetreten.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        className="p-6 sm:p-8 rounded-3xl shadow-lg backdrop-blur-sm"
        style={{ backgroundColor: `${colors.background}F0` }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <Mail className="w-6 h-6" style={{ color: colors.primary }} />
          <h3 className="text-xl font-bold" style={{ color: colors.primary }}>
            Anmelden
          </h3>
        </div>

        <form onSubmit={handleSendEmail} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.primary }}>
              E-Mail-Adresse
            </label>
            <Input
              type="email"
              placeholder="deine@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-xl border-2 focus:outline-none focus:ring-2"
              style={{ 
                borderColor: colors.tertiary,
                backgroundColor: colors.background,
                color: colors.primary
              }}
            />
          </div>

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
                <span>Wird gesendet...</span>
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                <span>E-Mail senden</span>
              </>
            )}
          </Button>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-xl border-2 ${
            messageType === 'success' 
              ? 'border-green-500 bg-green-50' 
              : 'border-red-500 bg-red-50'
          }`}>
            <div className="flex items-center space-x-2">
              <CheckCircle className={`w-5 h-5 ${
                messageType === 'success' ? 'text-green-600' : 'text-red-600'
              }`} />
              <p className={`text-sm ${
                messageType === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {message}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 text-xs text-center" style={{ color: colors.secondary }}>
          <p>• Du erhältst eine E-Mail zur Bestätigung</p>
          <p>• Klicke auf den Link in der E-Mail, um dich anzumelden</p>
          <p>• Kein Passwort erforderlich</p>
        </div>
      </div>
    </div>
  )
} 