import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin
  const errorUrl = (error: string) => new URL(`/auth/callback/error?error=${error}`, origin)

  if (!code) {
    console.error('[Auth Callback] No code provided')
    return NextResponse.redirect(errorUrl('code'))
  }

  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    console.log('[Auth Callback] Exchanging code for session')
    const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (sessionError) {
      console.error('[Auth Callback] Session error:', sessionError)
      return NextResponse.redirect(errorUrl('session'))
    }

    if (!session?.user) {
      console.error('[Auth Callback] No user in session')
      return NextResponse.redirect(errorUrl('session'))
    }

    // Set the session immediately after exchange
    await supabase.auth.setSession(session)

    console.log('[Auth Callback] Checking user profile')
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('firstname, lastname, phone, email')
      .eq('id', session.user.id)
      .single()

    if (userError) {
      console.error('[Auth Callback] User fetch error:', userError)
      return NextResponse.redirect(errorUrl('profile'))
    }

    // Check if profile is incomplete
    if (!user || !user.firstname || !user.lastname || !user.phone) {
      console.log('[Auth Callback] Incomplete profile, redirecting to profile completion')
      const response = NextResponse.redirect(new URL('/auth/complete-profile', origin))
      return response
    }

    console.log('[Auth Callback] Authentication successful, redirecting to home')
    const response = NextResponse.redirect(new URL('/home', origin))
    
    // Set welcome back cookie
    response.cookies.set('welcome_back', 'true', {
      path: '/',
      maxAge: 30,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    
    return response
  } catch (error) {
    console.error('[Auth Callback] Unexpected error:', error)
    return NextResponse.redirect(errorUrl('callback'))
  }
}