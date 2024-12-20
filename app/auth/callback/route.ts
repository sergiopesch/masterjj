import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Database } from '@/lib/types/database'
import { PostgrestError } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin
  const errorUrl = (error: string) => new URL(`/auth/error?error=${error}`, origin)

  // Enhanced error handling for missing code
  if (!code) {
    console.error('[Auth Callback] No code provided')
    return NextResponse.redirect(errorUrl('missing_code'))
  }

  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
    
    console.log('[Auth Callback] Exchanging code for session')
    const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (sessionError) {
      console.error('[Auth Callback] Session error:', sessionError)
      return NextResponse.redirect(errorUrl('invalid_session'))
    }

    if (!session?.user) {
      console.error('[Auth Callback] No user in session')
      return NextResponse.redirect(errorUrl('missing_user'))
    }

    // Try to get existing profile
    console.log('[Auth Callback] Checking user profile')
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('firstname, lastname, phone, email')
      .eq('id', session.user.id)
      .single()

    // If profile doesn't exist or we got a "no rows returned" error
    const isProfileMissing = !profile || (profileError && (profileError as PostgrestError).code === 'PGRST116')
    
    if (isProfileMissing) {
      console.log('[Auth Callback] No profile found, creating initial profile')
      const { error: createError } = await supabase
        .from('users')
        .insert({
          id: session.user.id,
          email: session.user.email,
          firstname: session.user.user_metadata?.name?.split(' ')[0] || '',
          lastname: session.user.user_metadata?.name?.split(' ').slice(1).join(' ') || '',
          role: 'student',
          created_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          is_anonymous: false,
          auth_provider: 'google'
        })

      if (createError) {
        console.error('[Auth Callback] Profile creation error:', createError)
        return NextResponse.redirect(errorUrl('profile_creation_failed'))
      }

      // Redirect to complete profile for new users
      return NextResponse.redirect(new URL('/auth/complete-profile', origin))
    }

    // For existing profiles, check if all required fields are present
    const hasRequiredFields = 
      profile.firstname?.trim() && 
      profile.lastname?.trim() && 
      profile.phone?.trim()

    if (!hasRequiredFields) {
      console.log('[Auth Callback] Missing required fields, redirecting to complete profile')
      return NextResponse.redirect(new URL('/auth/complete-profile', origin))
    }

    // All required fields are present, redirect to dashboard
    console.log('[Auth Callback] Profile complete, redirecting to dashboard')
    return NextResponse.redirect(new URL('/dashboard', origin))

  } catch (error) {
    console.error('[Auth Callback] Unexpected error:', error)
    return NextResponse.redirect(errorUrl('unexpected_error'))
  }
}