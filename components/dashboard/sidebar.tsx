"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Calendar,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Users,
  Video,
  LogOut,
  Sliders,
  Trophy,
  ClipboardList,
  BookCheck
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import type { Route } from 'next'

interface NavItem {
  href: Route
  title: string
  icon: any
  role?: string[]
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: NavItem[]
}

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const { profile, signOut } = useAuth()

  const sidebarItems: NavItem[] = [
    {
      href: "/dashboard" as Route,
      title: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/classes" as Route,
      title: "Classes",
      icon: Calendar,
    },
    {
      href: "/dashboard/techniques" as Route,
      title: "Techniques Library",
      icon: Video,
    },
    {
      href: "/dashboard/progress" as Route,
      title: "My Progress",
      icon: GraduationCap,
      role: ["student"],
    },
    {
      href: "/dashboard/achievements" as Route,
      title: "Achievements",
      icon: Trophy,
      role: ["student"],
    },
    {
      href: "/dashboard/students" as Route,
      title: "Student Management",
      icon: Users,
      role: ["admin", "instructor"],
    },
    {
      href: "/dashboard/curriculum" as Route,
      title: "Curriculum Planning",
      icon: ClipboardList,
      role: ["instructor"],
    },
    {
      href: "/dashboard/grading" as Route,
      title: "Student Grading",
      icon: BookCheck,
      role: ["instructor"],
    },
    {
      href: "/dashboard/instructor-settings" as Route,
      title: "Instructor Settings",
      icon: Sliders,
      role: ["instructor"],
    },
    {
      href: "/dashboard/admin" as Route,
      title: "Admin Panel",
      icon: Settings,
      role: ["admin"],
    },
    {
      href: "/dashboard/settings" as Route,
      title: "Profile Settings",
      icon: Settings,
    },
  ]

  const filteredItems = sidebarItems.filter(
    (item) => !item.role || (profile?.role && item.role.includes(profile.role))
  )

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <nav className={cn("flex flex-col h-screen border-r", className)}>
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <span className="font-bold">Master BJJ</span>
        </Link>
      </div>
      <div className="flex-1 px-4 space-y-2">
        {filteredItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2",
              pathname === item.href && "bg-muted"
            )}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        ))}
      </div>
      <div className="p-4 mt-auto border-t">
        <div className="mb-4 px-2">
          <p className="text-sm font-medium">{profile?.firstname} {profile?.lastname}</p>
          <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </nav>
  )
}