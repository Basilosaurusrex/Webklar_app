import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const accessToken = requestUrl.searchParams.get('access_token')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  console.log('=== AUTH CALLBACK DEBUG ===')
  console.log('Code:', code)
  console.log('Access Token:', accessToken ? 'present' : 'not present')
  console.log('Error:', error)
  console.log('Error Description:', errorDescription)

  // Handle error cases
  if (error) {
    console.error('Auth callback error:', { error, errorDescription })
    
    // Redirect to error page or back to auth with error message
    const errorUrl = new URL('/auth', requestUrl.origin)
    errorUrl.searchParams.set('error', error)
    errorUrl.searchParams.set('error_description', errorDescription || '')
    
    return NextResponse.redirect(errorUrl)
  }

  // Handle successful authentication
  if (code || accessToken) {
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      if (code) {
        // Handle code-based authentication
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        
        console.log('Session exchange result:', { data, error: exchangeError })
        
        if (exchangeError) {
          console.error('Session exchange error:', exchangeError)
          
          // Redirect to error page
          const errorUrl = new URL('/auth', requestUrl.origin)
          errorUrl.searchParams.set('error', 'session_exchange_failed')
          errorUrl.searchParams.set('error_description', exchangeError.message)
          
          return NextResponse.redirect(errorUrl)
        }
      } else if (accessToken) {
        // Handle token-based authentication
        console.log('✅ Token-based authentication successful')
        
        // Set the session manually
        const { data, error: setSessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: requestUrl.searchParams.get('refresh_token') || ''
        })
        
        if (setSessionError) {
          console.error('Session set error:', setSessionError)
          
          const errorUrl = new URL('/auth', requestUrl.origin)
          errorUrl.searchParams.set('error', 'session_set_failed')
          errorUrl.searchParams.set('error_description', setSessionError.message)
          
          return NextResponse.redirect(errorUrl)
        }
      }
      
      console.log('✅ Authentication successful')
    } catch (err) {
      console.error('Unexpected error in auth callback:', err)
      
      const errorUrl = new URL('/auth', requestUrl.origin)
      errorUrl.searchParams.set('error', 'unexpected_error')
      errorUrl.searchParams.set('error_description', 'Ein unerwarteter Fehler ist aufgetreten')
      
      return NextResponse.redirect(errorUrl)
    }
  }

  // Redirect to success page instead of home page
  console.log('✅ Redirecting to success page')
  return NextResponse.redirect(`${requestUrl.origin}/success`)
} 