import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/success'

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
        // Redirect to auth page with error
        return NextResponse.redirect(
          `${requestUrl.origin}/auth?error=auth_callback_error&error_description=${encodeURIComponent(error.message)}`
        )
      }

      if (data.session) {
        // Successfully authenticated
        console.log('User authenticated successfully:', data.user?.email)
        
        // Check if this is an appointment booking verification
        const userMetadata = data.user?.user_metadata
        if (userMetadata?.appointment_booking) {
          // Redirect to success page for appointment booking
          return NextResponse.redirect(`${requestUrl.origin}/success`)
        } else {
          // Redirect to admin dashboard or default page
          return NextResponse.redirect(`${requestUrl.origin}/kunden-projekte`)
        }
      }
    } catch (error) {
      console.error('Unexpected error in auth callback:', error)
      return NextResponse.redirect(
        `${requestUrl.origin}/auth?error=unexpected_error&error_description=${encodeURIComponent('Ein unerwarteter Fehler ist aufgetreten.')}`
      )
    }
  }

  // If no code, redirect to auth page
  return NextResponse.redirect(`${requestUrl.origin}/auth`)
} 