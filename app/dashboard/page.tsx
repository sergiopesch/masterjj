'use client'

import { useAuth } from "@/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, GraduationCap, Trophy, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { profile, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If not loading and no profile, redirect to sign in
    if (!isLoading && !profile) {
      router.push('/auth/sign-in')
    }
  }, [isLoading, profile, router])

  // Don't render anything while loading or if no profile
  if (isLoading || !profile) {
    return null
  }

  const stats = [
    {
      title: "Upcoming Classes",
      value: "3",
      description: "This week",
      icon: Calendar,
    },
    {
      title: "Techniques Learned",
      value: "24",
      description: "Last 30 days",
      icon: GraduationCap,
    },
    {
      title: "Achievements",
      value: "5",
      description: "Total earned",
      icon: Trophy,
    },
    {
      title: profile.role === 'instructor' ? "Active Students" : "Training Partners",
      value: "12",
      description: "In your circle",
      icon: Users,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {profile.firstname}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your BJJ journey today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}