import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Database } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin
  const errorUrl = (error: string) => new URL(`/auth/error?error=${error}`, origin)

  if (!code) {
    console.error('[Google Callback] No code provided')
    return NextResponse.redirect(errorUrl('missing_code'))
  }

  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
    
    console.log('[Google Callback] Exchanging code for session')
    const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (sessionError) {
      console.error('[Google Callback] Session error:', sessionError)
      return NextResponse.redirect(errorUrl('invalid_session'))
    }

    if (!session?.user) {
      console.error('[Google Callback] No user in session')
      return NextResponse.redirect(errorUrl('missing_user'))
    }

    // Check if user already exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (userError && userError.code !== 'PGRST116') {
      console.error('[Google Callback] User fetch error:', userError)
      return NextResponse.redirect(errorUrl('user_error'))
    }

    // If user doesn't exist, create initial profile
    if (!user) {
      console.log('[Google Callback] Creating initial profile')
      const { error: createError } = await supabase
        .from('users')
        .insert({
          id: session.user.id,
          email: session.user.email,
          firstname: session.user.user_metadata?.full_name?.split(' ')[0] || '',
          lastname: session.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
          role: 'student',
          created_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          is_anonymous: false,
          auth_provider: 'google'
        })

      if (createError) {
        console.error('[Google Callback] Profile creation error:', createError)
        return NextResponse.redirect(errorUrl('profile_creation_failed'))
      }

      return NextResponse.redirect(new URL('/auth/complete-profile', origin))
    }

    // Check if profile is complete
    if (!user.firstname || !user.lastname || !user.phone) {
      return NextResponse.redirect(new URL('/auth/complete-profile', origin))
    }

    // Profile is complete, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', origin))

  } catch (error) {
    console.error('[Google Callback] Unexpected error:', error)
    return NextResponse.redirect(errorUrl('unexpected_error'))
  }
}
