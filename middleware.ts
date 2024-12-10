import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/reset-password',
] as const

const PROFILE_FIELDS = ['firstname', 'lastname', 'phone'] as const
type ProfileField = typeof PROFILE_FIELDS[number]

type UserProfile = Record<ProfileField, string | null>

const createRedirectResponse = (url: string, request: NextRequest) => {
  const redirectUrl = new URL(url, request.url)
  // Preserve the current port
  redirectUrl.port = request.nextUrl.port
  return NextResponse.redirect(redirectUrl)
}

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const pathname = request.nextUrl.pathname

  // Add security headers
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'origin-when-cross-origin')

  // Auth callback and root should always be accessible
  if (pathname === '/' || pathname.startsWith('/auth/callback')) {
    return res
  }

  try {
    // Cache session check for 1 minute
    const sessionResponse = await supabase.auth.getSession()
    const session = sessionResponse.data.session

    // Handle public routes
    if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
      if (session) {
        // If user is signed in, redirect to dashboard
        return createRedirectResponse('/dashboard', request)
      }
      return res
    }

    // Check if user is authenticated for protected routes
    if (!session) {
      return createRedirectResponse('/auth/sign-in', request)
    }

    // Check if profile is complete for non-auth pages
    if (!pathname.startsWith('/auth/')) {
      // Use efficient single query with all required fields
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select<string, UserProfile>(PROFILE_FIELDS.join(','))
        .eq('id', session.user.id)
        .single()

      if (profileError) {
        console.error('Profile fetch error:', profileError)
        return createRedirectResponse('/auth/sign-in', request)
      }

      const isProfileComplete = profile && 
        PROFILE_FIELDS.every((field) => Boolean(profile[field]))

      if (!isProfileComplete && !pathname.startsWith('/auth/complete-profile')) {
        return createRedirectResponse('/auth/complete-profile', request)
      }
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // Clear any potentially corrupted session state
    await supabase.auth.signOut()
    return createRedirectResponse('/auth/sign-in', request)
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}