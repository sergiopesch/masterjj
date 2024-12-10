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
    console.log('Getting user session...')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      return null
    }
    
    if (!session?.user) {
      console.log('No session found')
      return null
    }
    
    console.log('Getting user profile...')
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, firstname, lastname, phone, email, role, created_at, last_sign_in_at, is_anonymous')
      .eq('id', session.user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return null
    }

    console.log('Profile found:', profile)
    return profile
  } catch (error) {
    console.error('Unexpected error in getUserProfile:', error)
    return null
  }
}

export async function updateUserProfile(updates: UpdateUserProfile): Promise<UserProfile | null> {
  const supabase = createClientComponentClient<Database>()
  
  try {
    console.log('Getting user...')
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('Error getting user:', userError)
      throw userError
    }
    
    if (!user) {
      console.error('No user found')
      throw new Error('Not authenticated')
    }

    console.log('Updating profile...')
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select('id, firstname, lastname, phone, email, role, created_at, last_sign_in_at, is_anonymous')
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      throw error
    }

    console.log('Profile updated:', data)
    return data
  } catch (error) {
    console.error('Unexpected error updating user profile:', error)
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
  
  try {
    console.log('Signing out...')
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      throw error
    }
    console.log('Successfully signed out')
    removeUser()
    return { error: null }
  } catch (error) {
    console.error('Unexpected error signing out:', error)
    throw error
  }
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