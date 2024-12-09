import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const error = requestUrl.searchParams.get('error')
    const error_description = requestUrl.searchParams.get('error_description')

    if (error || !code) {
      return NextResponse.redirect(
        new URL(
          `/auth/sign-in?error=${encodeURIComponent(
            error_description || 'Something went wrong. Please try again.'
          )}`,
          requestUrl.origin
        )
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Exchange the code for a session
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

    if (sessionError) {
      console.error('Session error:', sessionError)
      return NextResponse.redirect(
        new URL(
          `/auth/sign-in?error=${encodeURIComponent(
            'Failed to verify your email. Please try again.'
          )}`,
          requestUrl.origin
        )
      )
    }

    // Get the user session to confirm it worked
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.redirect(
        new URL(
          `/auth/sign-in?error=${encodeURIComponent(
            'Unable to verify your session. Please try signing in again.'
          )}`,
          requestUrl.origin
        )
      )
    }

    // Successfully authenticated, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(
      new URL(
        `/auth/sign-in?error=${encodeURIComponent(
          'An unexpected error occurred. Please try again.'
        )}`,
        request.url
      )
    )
  }
}