'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUserProfile, signOut } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Activity,
  Calendar,
  Clock,
  Trophy,
  TrendingUp,
  Users,
  LogOut,
} from 'lucide-react'
import type { UserProfile } from '@/lib/types/database'

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      const userProfile = await getUserProfile()
      if (!userProfile) {
        router.push('/auth/sign-in')
        return
      }
      setProfile(userProfile)
      setLoading(false)
    }
    loadProfile()
  }, [router])

  if (loading) {
    return <AppLayout requireAuth>Loading...</AppLayout>
  }

  if (!profile) {
    return <AppLayout requireAuth>Please sign in to continue</AppLayout>
  }

  return (
    <AppLayout requireAuth>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome, {profile.firstname || 'User'}!
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Your recent activity and progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>View your scheduled classes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Track your milestones</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Button
            variant="outline"
            onClick={async () => {
              await signOut()
              router.push('/auth/sign-in')
            }}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}