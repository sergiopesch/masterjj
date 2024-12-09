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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileVideo,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react"

const techniques = [
  {
    id: 1,
    name: "Armbar from Guard",
    category: "Submissions",
    difficulty: "Beginner",
    lastTaught: "2024-02-15",
    views: 245,
  },
  {
    id: 2,
    name: "Spider Guard Sweep",
    category: "Sweeps",
    difficulty: "Intermediate",
    lastTaught: "2024-02-18",
    views: 189,
  },
]

export default function TechniquesPage() {
  const router = useRouter()
  const user = getUser()
  const [search, setSearch] = useState("")

  if (!user || !["admin", "instructor"].includes(user.role)) {
    router.push("/dashboard")
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Technique Library
          </h1>
          <p className="text-muted-foreground">
            Manage and organize your BJJ techniques
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Technique
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Technique Management</CardTitle>
                <CardDescription>
                  Browse and manage your technique library
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="submissions">Submissions</TabsTrigger>
                  <TabsTrigger value="sweeps">Sweeps</TabsTrigger>
                  <TabsTrigger value="passes">Passes</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search techniques..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-8 w-[200px]"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value="all" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {techniques.map((technique) => (
                    <Card key={technique.id}>
                      <CardHeader className="relative">
                        <div className="absolute -top-2 -right-2">
                          <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-full h-8 w-8"
                          >
                            <FileVideo className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardTitle className="text-lg">
                          {technique.name}
                        </CardTitle>
                        <CardDescription>
                          {technique.category} • {technique.difficulty}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Last taught: {technique.lastTaught}</span>
                          <span>{technique.views} views</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}