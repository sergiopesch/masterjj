'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { AdminDashboard } from '@/components/dashboard/admin-dashboard'
import { InstructorDashboard } from '@/components/dashboard/instructor-dashboard'
import { StudentDashboard } from '@/components/dashboard/student-dashboard'
import { AuthFlow } from '@/components/auth/auth-flow'
import { RoleBasedNav } from '@/components/layout/role-based-nav'
import type { Database, UserProfile } from '@/lib/types/database'

interface AppLayoutProps {
  requireAuth?: boolean
  children?: React.ReactNode
}

export function AppLayout({ requireAuth = false, children }: AppLayoutProps) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(requireAuth)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    if (!requireAuth) return

    const loadUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (!authUser) {
          setUser(null)
          setLoading(false)
          return
        }

        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('email', authUser.email)
          .single()

        setUser(profile)
      } catch (error) {
        console.error('Error loading user:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user.email) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .single()

          setUser(profile)
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [requireAuth])

  if (requireAuth) {
    if (loading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )
    }

    if (!user) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
          <AuthFlow />
        </div>
      )
    }

    return (
      <div className="flex h-screen">
        <RoleBasedNav />
        <main className="flex-1 overflow-auto">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-8">
              Welcome back, {user.firstname}!
            </h1>
            {children || (
              <>
                {user.role === 'admin' && <AdminDashboard />}
                {user.role === 'instructor' && <InstructorDashboard />}
                {user.role === 'student' && <StudentDashboard />}
              </>
            )}
          </div>
        </main>
      </div>
    )
  }

  // If auth is not required, just render children
  return <>{children}</>
}
