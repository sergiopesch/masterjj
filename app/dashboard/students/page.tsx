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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { StudentTable } from "@/components/dashboard/students/student-table"
import { StatsCard } from "@/components/dashboard/students/stats-card"
import { Calendar, Clock, Search, UserPlus } from "lucide-react"

const students = [
  {
    id: 1,
    name: "John Smith",
    belt: "Blue",
    stripes: 2,
    attendance: "85%",
    lastClass: "2024-02-20",
    progress: "Good",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    belt: "Purple",
    stripes: 3,
    attendance: "92%",
    lastClass: "2024-02-21",
    progress: "Excellent",
  },
]

export default function StudentsPage() {
  const router = useRouter()
  const user = getUser()
  const [search, setSearch] = useState("")

  if (!user || !["admin", "instructor"].includes(user.role)) {
    router.push("/dashboard")
    return null
  }

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleViewDetails = (studentId: number) => {
    console.log(`Viewing details for student ${studentId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage and track your students' progress
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard
          title="Total Students"
          value="45"
          description="+2 from last month"
          icon={UserPlus}
        />
        <StatsCard
          title="Average Attendance"
          value="87%"
          description="+5% from last month"
          icon={Calendar}
        />
        <StatsCard
          title="Training Hours"
          value="256"
          description="Total this month"
          icon={Clock}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Management</CardTitle>
          <CardDescription>
            View and manage all your students in one place
          </CardDescription>
          <div className="flex items-center gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <StudentTable 
            students={filteredStudents}
            onViewDetails={handleViewDetails}
          />
        </CardContent>
      </Card>
    </div>
  )
}