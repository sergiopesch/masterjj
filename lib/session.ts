'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import * as React from 'react'
import { useRouter } from 'next/navigation'

const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds
const ACTIVITY_TIMEOUT = 15 * 60 * 1000 // 15 minutes in milliseconds
let activityTimeout: NodeJS.Timeout
let sessionTimeout: NodeJS.Timeout

interface SessionHook {
  handleLogout: () => Promise<void>
  resetTimeouts: () => void
}

export function useSession(): SessionHook {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogout = React.useCallback(async () => {
    await supabase.auth.signOut()
    router.push('/auth/sign-in')
  }, [router, supabase.auth])

  const resetTimeouts = React.useCallback(() => {
    if (activityTimeout) clearTimeout(activityTimeout)
    if (sessionTimeout) clearTimeout(sessionTimeout)

    activityTimeout = setTimeout(async () => {
      await handleLogout()
    }, ACTIVITY_TIMEOUT)

    sessionTimeout = setTimeout(async () => {
      await handleLogout()
    }, SESSION_TIMEOUT)
  }, [handleLogout])

  React.useEffect(() => {
    resetTimeouts()

    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'mousemove']
    const handleActivity = () => {
      resetTimeouts()
    }

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity)
    })

    const checkSession = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        handleLogout()
      }
    }, 60000) // Check every minute

    return () => {
      if (activityTimeout) clearTimeout(activityTimeout)
      if (sessionTimeout) clearTimeout(sessionTimeout)
      clearInterval(checkSession)
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [handleLogout, resetTimeouts, supabase])

  return {
    handleLogout,
    resetTimeouts,
  }
}

type WithSessionProps = Record<string, unknown>

export function withSession<P extends WithSessionProps>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  const WithSessionComponent: React.FC<P> = (props) => {
    const { resetTimeouts } = useSession()

    React.useEffect(() => {
      resetTimeouts()
    }, [resetTimeouts])

    return React.createElement(WrappedComponent, props)
  }

  WithSessionComponent.displayName = `withSession(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`

  return WithSessionComponent
}