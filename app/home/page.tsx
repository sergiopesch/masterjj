'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { getUserProfile } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { Icons } from '@/components/ui/icons'
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
        const userProfile = await getUserProfile()
        
        if (mounted) {
          if (!userProfile || !userProfile.firstname || !userProfile.lastname || !userProfile.phone) {
            setLoading(false)
            router.replace('/auth/complete-profile')
            return
          }

          setProfile(userProfile)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        if (mounted) {
          setLoading(false)
          router.replace('/auth/sign-in')
        }
      }
    }

    loadProfile()

    return () => {
      mounted = false
    }
  }, [router, supabase])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Icons.spinner className="mx-auto h-8 w-8 animate-spin" />
          <p className="mt-4 text-lg text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <AppLayout>
      <div className="container mx-auto py-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">
                +20% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Class</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Tomorrow</div>
              <p className="text-xs text-muted-foreground">
                10:00 AM - Fundamentals
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Belt Level</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">White Belt</div>
              <p className="text-xs text-muted-foreground">
                2 stripes
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
