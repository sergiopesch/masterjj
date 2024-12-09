"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUser } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Activity,
  Calendar,
  Clock,
  Trophy,
  TrendingUp,
  Users,
} from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const user = getUser()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [router])

  if (!user) return null

  const stats = [
    {
      title: "Classes Attended",
      value: "24",
      icon: Calendar,
      description: "This month",
    },
    {
      title: "Training Hours",
      value: "48",
      icon: Clock,
      description: "Total hours",
    },
    {
      title: "Techniques Learned",
      value: "156",
      icon: Activity,
      description: "Documented",
    },
    {
      title: "Current Streak",
      value: "8",
      icon: TrendingUp,
      description: "Days",
    },
  ]

  const instructorStats = [
    {
      title: "Active Students",
      value: "45",
      icon: Users,
      description: "Currently enrolled",
    },
    {
      title: "Classes Taught",
      value: "32",
      icon: Calendar,
      description: "This month",
    },
    {
      title: "Student Progress",
      value: "85%",
      icon: Trophy,
      description: "Average improvement",
    },
    {
      title: "Teaching Hours",
      value: "64",
      icon: Clock,
      description: "This month",
    },
  ]

  const displayStats = user.role === "instructor" ? instructorStats : stats

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {displayStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
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
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 text-sm text-muted-foreground"
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Completed Advanced Guard class</span>
                  <span className="ml-auto">2h ago</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 text-sm text-muted-foreground"
                >
                  <Calendar className="h-4 w-4" />
                  <span>No-Gi Fundamentals</span>
                  <span className="ml-auto">Tomorrow, 10:00 AM</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}