'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/types/database'
import { toast } from 'sonner'

interface AuthState {
  user: User | null
  profile: Database['public']['Tables']['users']['Row'] | null
  isLoading: boolean
}

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  updateProfile: (data: Partial<Database['public']['Tables']['users']['Update']>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
  })

  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const refreshProfile = async () => {
    try {
      console.log('Refreshing profile...')
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Session error:', sessionError)
        setState(prev => ({ ...prev, profile: null, user: null, isLoading: false }))
        return
      }

      if (!session?.user) {
        console.log('No session found')
        setState(prev => ({ ...prev, profile: null, user: null, isLoading: false }))
        return
      }

      // Debug: Log user metadata from session
      console.log('User Metadata:', {
        id: session.user.id,
        email: session.user.email,
        metadata: session.user.user_metadata,
      })

      setState(prev => ({ ...prev, user: session.user }))

      // Try to get existing profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()

      // If profile exists, update state and check completeness
      if (profile) {
        console.log('Existing profile found:', profile)
        setState(prev => ({
          ...prev,
          profile,
          isLoading: false
        }))

        // Check if profile needs completion
        if (!profile.phone || !profile.firstname || !profile.lastname) {
          console.log('Profile incomplete, redirecting to complete profile')
          router.push('/auth/complete-profile')
        }
        return
      }

      // If no profile exists (either error or null result), create one
      console.log('No profile found, creating initial profile')
      const names = session.user.user_metadata?.name?.split(' ') || []
      const firstname = names[0] || ''
      const lastname = names.slice(1).join(' ') || ''

      const { data: newProfile, error: createError } = await supabase
        .from('users')
        .insert({
          id: session.user.id,
          email: session.user.email,
          firstname,
          lastname,
          role: 'student',
          created_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          is_anonymous: false,
          auth_provider: 'google'
        })
        .select()
        .single()

      if (createError) {
        console.error('Failed to create profile:', createError)
        setState(prev => ({ ...prev, profile: null, isLoading: false }))
        return
      }

      console.log('Created new profile:', newProfile)
      setState(prev => ({
        ...prev,
        profile: newProfile,
        isLoading: false
      }))

      // Always redirect to complete profile for new users
      router.push('/auth/complete-profile')
    } catch (error) {
      console.error('Error in profile operations:', error)
      setState(prev => ({ ...prev, profile: null, isLoading: false }))
    }
  }

  const updateProfile = async (data: Partial<Database['public']['Tables']['users']['Update']>) => {
    try {
      if (!state.user?.id) {
        throw new Error('No user ID available')
      }

      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', state.user.id)

      if (error) throw error

      toast.success('Profile updated successfully')
      await refreshProfile()
      router.push('/dashboard')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }))
      await supabase.auth.signOut()
      setState({ user: null, profile: null, isLoading: false })
      router.push('/auth/sign-in')
    } catch (error) {
      console.error('Error signing out:', error)
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }

  useEffect(() => {
    let mounted = true
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      if (session && mounted) {
        await refreshProfile()
      } else {
        setState({ user: null, profile: null, isLoading: false })
      }
    })

    if (mounted) {
      refreshProfile()
    }

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    ...state,
    signOut,
    refreshProfile,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
