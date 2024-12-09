"use client"

import { useRouter } from "next/navigation"
import { getUser } from "@/lib/auth"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

const attendanceData = [
  { month: "Jan", students: 35 },
  { month: "Feb", students: 42 },
  { month: "Mar", students: 45 },
  { month: "Apr", students: 50 },
  { month: "May", students: 48 },
  { month: "Jun", students: 52 },
]

const progressData = [
  { name: "Week 1", submissions: 12, sweeps: 8, passes: 15 },
  { name: "Week 2", submissions: 15, sweeps: 12, passes: 18 },
  { name: "Week 3", submissions: 18, sweeps: 15, passes: 20 },
  { name: "Week 4", submissions: 22, sweeps: 18, passes: 25 },
]

const beltDistribution = [
  { belt: "White", count: 20 },
  { belt: "Blue", count: 15 },
  { belt: "Purple", count: 8 },
  { belt: "Brown", count: 4 },
  { belt: "Black", count: 2 },
]

export default function ProgressPage() {
  const router = useRouter()
  const user = getUser()

  if (!user || !["admin", "instructor"].includes(user.role)) {
    router.push("/dashboard")
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Progress Tracking</h1>
        <p className="text-muted-foreground">
          Monitor student progress and class performance
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Class Attendance</CardTitle>
                <CardDescription>Monthly attendance overview</CardDescription>
              </div>
              <Select defaultValue="6months">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">Last 3 months</SelectItem>
                  <SelectItem value="6months">Last 6 months</SelectItem>
                  <SelectItem value="1year">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="students"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technique Progress</CardTitle>
            <CardDescription>
              Weekly breakdown of technique categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="submissions"
                    fill="hsl(var(--primary))"
                    stackId="a"
                  />
                  <Bar
                    dataKey="sweeps"
                    fill="hsl(var(--secondary))"
                    stackId="a"
                  />
                  <Bar
                    dataKey="passes"
                    fill="hsl(var(--muted))"
                    stackId="a"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Belt Distribution</CardTitle>
            <CardDescription>
              Current distribution of belt ranks among students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={beltDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="belt" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}