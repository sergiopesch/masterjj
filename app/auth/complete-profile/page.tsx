'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from '@/components/ui/use-toast'
import type { Database } from '@/lib/types/database'

interface ProfileData {
  firstname: string
  lastname: string
  phone: string
}

export default function CompleteProfilePage() {
  const router = useRouter()
  const [profileData, setProfileData] = useState<ProfileData>({
    firstname: '',
    lastname: '',
    phone: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/sign-in')
        return
      }

      // Try to load existing profile data
      const { data: profile } = await supabase
        .from('users')
        .select('firstname, lastname, phone')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        setProfileData({
          firstname: profile.firstname || '',
          lastname: profile.lastname || '',
          phone: profile.phone || '',
        })
      }
    }

    checkSession()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('No session found')
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({
          firstname: profileData.firstname,
          lastname: profileData.lastname,
          phone: profileData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id)

      if (updateError) throw updateError

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully completed.',
      })

      router.push('/home')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Please provide your details to continue
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstname">First Name</Label>
              <Input
                id="firstname"
                placeholder="Enter your first name"
                value={profileData.firstname}
                onChange={(e) => setProfileData(prev => ({ ...prev, firstname: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname">Last Name</Label>
              <Input
                id="lastname"
                placeholder="Enter your last name"
                value={profileData.lastname}
                onChange={(e) => setProfileData(prev => ({ ...prev, lastname: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Complete Profile'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
