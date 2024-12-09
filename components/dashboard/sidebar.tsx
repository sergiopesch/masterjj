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
} from "lucide-react"
import { removeUser, getUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: any
    role?: string[]
  }[]
}

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const user = getUser()

  const sidebarItems = [
    {
      href: "/dashboard",
      title: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/classes",
      title: "Classes",
      icon: Calendar,
    },
    {
      href: "/dashboard/techniques",
      title: "Techniques",
      icon: Video,
    },
    {
      href: "/dashboard/progress",
      title: "Progress",
      icon: GraduationCap,
    },
    {
      href: "/dashboard/students",
      title: "Students",
      icon: Users,
      role: ["admin", "instructor"],
    },
    {
      href: "/dashboard/instructor-settings",
      title: "Instructor Settings",
      icon: Sliders,
      role: ["instructor"],
    },
    {
      href: "/dashboard/settings",
      title: "Settings",
      icon: Settings,
    },
  ]

  const filteredItems = sidebarItems.filter(
    (item) => !item.role || (user && item.role.includes(user.role))
  )

  const handleLogout = () => {
    removeUser()
    router.push("/login")
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