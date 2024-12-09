"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Users } from "lucide-react"

export function StudentStats() {
  const stats = [
    {
      title: "Total Students",
      value: "45",
      description: "+2 from last month",
      icon: Users,
    },
    {
      title: "Average Attendance",
      value: "87%",
      description: "+5% from last month",
      icon: Calendar,
    },
    {
      title: "Training Hours",
      value: "256",
      description: "Total this month",
      icon: Clock,
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}