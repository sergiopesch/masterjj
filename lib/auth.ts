import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { UserProfile, UpdateUserProfile, Database } from './types/database'

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "instructor" | "practitioner";
}

const users = {
  admin: {
    id: "1",
    email: "admin@example.com",
    password: "password",
    name: "Admin User",
    role: "admin",
  },
  instructor: {
    id: "2",
    email: "instructor@example.com",
    password: "password",
    name: "Instructor User",
    role: "instructor",
  },
  user: {
    id: "3",
    email: "user@example.com",
    password: "password",
    name: "Regular User",
    role: "practitioner",
  },
} as const;

export async function authenticate(
  email: string,
  password: string
): Promise<User | null> {
  const user = Object.values(users).find(
    (u) => u.email === email && u.password === password
  );

  if (!user) return null;

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = createClientComponentClient<Database>()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    return profile
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

export async function updateUserProfile(updates: Partial<Database['public']['Tables']['users']['Update']>): Promise<UserProfile | null> {
  const supabase = createClientComponentClient<Database>()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

export async function checkUserRole(allowedRoles: string[]) {
  const profile = await getUserProfile()
  if (!profile) return false
  return allowedRoles.includes(profile.role)
}

export async function isAdmin() {
  return checkUserRole(['admin'])
}

export async function isInstructor() {
  return checkUserRole(['admin', 'instructor'])
}

export function getRoleBasedRedirect(role: string) {
  switch (role) {
    case 'admin':
      return '/admin/dashboard'
    case 'instructor':
      return '/instructor/dashboard'
    default:
      return '/dashboard'
  }
}

export async function signOut() {
  const supabase = createClientComponentClient()
  await supabase.auth.signOut()
}

export function getUser(): User | null {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  return JSON.parse(userStr);
}

export function setUser(user: User) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function removeUser() {
  localStorage.removeItem("user");
}