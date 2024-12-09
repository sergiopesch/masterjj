'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import type { Database } from '@/lib/types/database'

type Step = 'email' | 'user-info' | 'verification'

interface UserInfo {
  firstname: string
  lastname: string
  phone: string
  email: string
  role: 'student' | 'instructor'
}

export function AuthFlow() {
  const [step, setStep] = useState<Step>('email')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    role: 'student',
  })
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const checkExistingProfile = async (email: string) => {
    const { data } = await supabase
      .from('users')
      .select('firstname, lastname, phone')
      .eq('email', email)
      .single()

    return data
  }

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Check if user exists in the database
      const profile = await checkExistingProfile(email)

      if (profile?.firstname && profile?.lastname && profile?.phone) {
        // User exists with complete profile, proceed with magic link
        await handleMagicLinkSignIn(email)
        setStep('verification')
      } else {
        // User needs to complete profile
        setUserInfo(prev => ({ ...prev, email }))
        setStep('user-info')
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUserInfoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      // First, send magic link
      await handleMagicLinkSignIn(userInfo.email)

      // Then, update or create user profile
      const { error: profileError } = await supabase
        .from('users')
        .upsert({
          email: userInfo.email,
          firstname: userInfo.firstname,
          lastname: userInfo.lastname,
          phone: userInfo.phone,
          role: userInfo.role,
        })

      if (profileError) throw profileError

      setStep('verification')
      toast({
        title: 'Success',
        description: 'Please check your email to sign in.',
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLinkSignIn = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) throw error
  }

  if (step === 'verification') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We sent a magic link to {email || userInfo.email}.<br />
            Click the link to sign in.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (step === 'user-info') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Please provide your details to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUserInfoSubmit} className="space-y-4">
            <Input
              placeholder="First Name"
              value={userInfo.firstname}
              onChange={(e) => setUserInfo({ ...userInfo, firstname: e.target.value })}
              required
            />
            <Input
              placeholder="Last Name"
              value={userInfo.lastname}
              onChange={(e) => setUserInfo({ ...userInfo, lastname: e.target.value })}
              required
            />
            <Input
              type="tel"
              placeholder="Phone Number"
              value={userInfo.phone}
              onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>
          Enter your email to sign in or create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Please wait...' : 'Continue with Email'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
