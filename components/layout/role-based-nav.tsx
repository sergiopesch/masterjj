'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Users,
  BookOpen,
  Calendar,
  Settings,
  User,
  LogOut,
  Shield,
  GraduationCap,
} from 'lucide-react'
import { getUserProfile } from '@/lib/auth'
import type { UserProfile } from '@/lib/types/database'

const roleBasedLinks = {
  admin: [
    { href: '/dashboard', label: 'Dashboard', icon: BookOpen },
    { href: '/users', label: 'Manage Users', icon: Users },
    { href: '/instructors', label: 'Instructors', icon: GraduationCap },
    { href: '/settings', label: 'Settings', icon: Settings },
  ],
  instructor: [
    { href: '/dashboard', label: 'Dashboard', icon: BookOpen },
    { href: '/my-classes', label: 'My Classes', icon: Calendar },
    { href: '/students', label: 'My Students', icon: Users },
    { href: '/profile', label: 'Profile', icon: User },
  ],
  student: [
    { href: '/dashboard', label: 'Dashboard', icon: BookOpen },
    { href: '/classes', label: 'Classes', icon: Calendar },
    { href: '/profile', label: 'Profile', icon: User },
  ],
}

const roleColors = {
  admin: 'bg-red-500/10 text-red-500',
  instructor: 'bg-blue-500/10 text-blue-500',
  student: 'bg-green-500/10 text-green-500',
}

const roleIcons = {
  admin: Shield,
  instructor: GraduationCap,
  student: User,
}

export function RoleBasedNav() {
  const pathname = usePathname()
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    async function loadProfile() {
      const data = await getUserProfile()
      setProfile(data)
    }
    loadProfile()
  }, [])

  if (!profile) return null

  const RoleIcon = roleIcons[profile.role] || User
  const links = roleBasedLinks[profile.role] || roleBasedLinks.student

  return (
    <div className="flex h-screen flex-col border-r bg-muted/10">
      <div className="flex h-14 items-center border-b px-4">
        <div className={cn('flex items-center gap-2 rounded-md px-2 py-1', roleColors[profile.role])}>
          <RoleIcon className="h-4 w-4" />
          <span className="font-medium capitalize">{profile.role}</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                pathname === link.href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          <div className="flex-1 truncate">
            <div className="font-medium">
              {profile.firstname} {profile.lastname}
            </div>
            <div className="text-sm text-muted-foreground truncate">
              {profile.email}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
