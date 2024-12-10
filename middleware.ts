import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Auth callback should always be accessible
  if (request.nextUrl.pathname.startsWith('/auth/callback')) {
    return res
  }

  if (!session) {
    // If no session, only allow access to auth pages
    if (!request.nextUrl.pathname.startsWith('/auth/')) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url))
    }
    return res
  }

  // User is signed in

  // Check if profile is complete for non-auth pages
  if (!request.nextUrl.pathname.startsWith('/auth/')) {
    try {
      const { data: profile } = await supabase
        .from('users')
        .select('firstname, lastname, phone')
        .eq('id', session.user.id)
        .single()

      if (!profile || !profile.firstname || !profile.lastname || !profile.phone) {
        // Redirect to profile completion unless already there
        if (!request.nextUrl.pathname.startsWith('/auth/complete-profile')) {
          return NextResponse.redirect(new URL('/auth/complete-profile', request.url))
        }
      }
    } catch (error) {
      console.error('Error checking profile:', error)
      return NextResponse.redirect(new URL('/auth/sign-in', request.url))
    }
  }

  // Prevent authenticated users from accessing auth pages (except profile completion)
  if (request.nextUrl.pathname.startsWith('/auth/') && 
      !request.nextUrl.pathname.startsWith('/auth/complete-profile')) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return res
}

export const config = {
  matcher: [
    '/home/:path*',
    '/dashboard/:path*',
    '/auth/:path*',
    '/',
  ],
}