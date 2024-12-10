'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { getUserProfile, signOut } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import {
  Activity,
  Calendar,
  Trophy,
  LogOut,
} from 'lucide-react'
import type { UserProfile } from '@/lib/types/database'
import { AppLayout } from '@/components/layout/app-layout'

export default function HomePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    let mounted = true

    const loadProfile = async () => {
      try {
        // Check session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          if (mounted) {
            setLoading(false)
            router.push('/auth/sign-in')
          }
          return
        }

        if (!session) {
          console.log('No session found')
          if (mounted) {
            setLoading(false)
            router.push('/auth/sign-in')
          }
          return
        }

        // Get user profile
        const userProfile = await getUserProfile()
        console.log('User profile:', userProfile)
        
        if (!userProfile) {
          console.log('No profile found, redirecting to profile completion')
          if (mounted) {
            setLoading(false)
            router.push('/auth/complete-profile')
          }
          return
        }

        if (!userProfile.firstname || !userProfile.lastname || !userProfile.phone) {
          console.log('Incomplete profile, redirecting to profile completion')
          if (mounted) {
            setLoading(false)
            router.push('/auth/complete-profile')
          }
          return
        }

        if (mounted) {
          setProfile(userProfile)
          setLoading(false)

          // Check for welcome_back cookie
          const welcomeBack = document.cookie.includes('welcome_back=true')
          if (welcomeBack) {
            // Remove the cookie
            document.cookie = 'welcome_back=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
            
            // Show welcome back toast
            toast({
              title: 'Welcome back!',
              description: `Good to see you again, ${userProfile.firstname}!`,
              duration: 5000,
            })
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        if (mounted) {
          setLoading(false)
          router.push('/auth/sign-in')
        }
      }
    }

    loadProfile()

    // Subscription to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        if (mounted) {
          setProfile(null)
          router.push('/auth/sign-in')
        }
      } else if (event === 'SIGNED_IN' && session) {
        loadProfile()
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router, supabase])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/auth/sign-in')
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-muted-foreground">Loading your profile...</p>
        </div>
      </AppLayout>
    )
  }

  if (!profile) return null

  return (
    <AppLayout>
      <div className="container mx-auto py-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Streak</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12 days</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Session</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Tomorrow</div>
              <p className="text-xs text-muted-foreground">9:00 AM with John</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sign Out</CardTitle>
              <LogOut className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
