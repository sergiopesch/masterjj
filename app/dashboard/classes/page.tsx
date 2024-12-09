"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getUser } from "@/lib/auth"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ClassList } from "@/components/dashboard/classes/class-list"
import { ClassScheduler } from "@/components/dashboard/classes/class-scheduler"

const classes = [
  {
    id: 1,
    name: "Fundamentals",
    time: "09:00 AM",
    duration: "1h",
    attendees: 12,
    maxCapacity: 20,
  },
  {
    id: 2,
    name: "Advanced Guard",
    time: "10:30 AM",
    duration: "1.5h",
    attendees: 8,
    maxCapacity: 15,
  },
  {
    id: 3,
    name: "Competition Prep",
    time: "06:00 PM",
    duration: "2h",
    attendees: 6,
    maxCapacity: 10,
  },
]

export default function ClassesPage() {
  const router = useRouter()
  const user = getUser()
  const [date, setDate] = useState<Date | undefined>(new Date())

  if (!user || !["admin", "instructor"].includes(user.role)) {
    router.push("/dashboard")
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Class Schedule</h1>
          <p className="text-muted-foreground">
            Manage your classes and attendance
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Today's Classes</CardTitle>
            <CardDescription>
              Overview of today's scheduled classes and attendance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClassList classes={classes} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Schedule and manage classes</CardDescription>
          </CardHeader>
          <CardContent>
            <ClassScheduler date={date} onDateSelect={setDate} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}