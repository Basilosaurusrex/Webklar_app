import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If no session and trying to access protected route
  if (!session && req.nextUrl.pathname.startsWith('/protected')) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  // If session exists and trying to access auth page
  if (session && req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/protected', req.url))
  }

  return res
}

export const config = {
  matcher: ['/protected/:path*', '/auth/:path*']
} 