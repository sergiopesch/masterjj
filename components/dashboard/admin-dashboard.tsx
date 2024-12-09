'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserManagement } from '@/components/admin/user-management'
import { Users, Award, Calendar, TrendingUp } from 'lucide-react'
import type { Database } from '@/lib/types/database'

interface DashboardStat {
  title: string
  value: number
  icon: React.ElementType
  description: string
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStat[]>([
    { title: 'Total Users', value: 0, icon: Users, description: 'Active users in the system' },
    { title: 'Instructors', value: 0, icon: Award, description: 'Active instructors' },
    { title: 'Classes', value: 0, icon: Calendar, description: 'Total classes scheduled' },
    { title: 'Growth', value: 0, icon: TrendingUp, description: 'New users this month' },
  ])
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact' })

      // Get instructor count
      const { count: instructorCount } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .eq('role', 'instructor')

      // Get new users this month
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const { count: newUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .gte('created_at', thirtyDaysAgo.toISOString())

      setStats([
        { title: 'Total Users', value: totalUsers || 0, icon: Users, description: 'Active users in the system' },
        { title: 'Instructors', value: instructorCount || 0, icon: Award, description: 'Active instructors' },
        { title: 'Classes', value: 0, icon: Calendar, description: 'Total classes scheduled' },
        { title: 'Growth', value: newUsers || 0, icon: TrendingUp, description: 'New users this month' },
      ])
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  return (
    <div className="space-y-8 p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <UserManagement />
        </CardContent>
      </Card>
    </div>
  )
}