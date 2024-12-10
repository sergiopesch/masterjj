"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from '@/components/ui/use-toast'

interface ProfileData {
  firstname: string
  lastname: string
  phone: string
}

export function LoginForm() {
  const router = useRouter()
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  })
  const [profileData, setProfileData] = React.useState<ProfileData>({
    firstname: "",
    lastname: "",
    phone: "",
  })
  const [error, setError] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [showProfileForm, setShowProfileForm] = React.useState(false)
  const [userId, setUserId] = React.useState<string>("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const supabase = createClientComponentClient()
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (signInError) throw signInError

      if (data?.user) {
        setUserId(data.user.id)
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('firstname, lastname, phone')
          .eq('id', data.user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') throw profileError

        // Check if profile is incomplete
        if (!profile || !profile.firstname || !profile.lastname || !profile.phone) {
          setShowProfileForm(true)
          setIsLoading(false)
          return
        }

        toast({
          title: 'Welcome back!',
          description: `Signed in as ${profile.firstname}`,
        })

        router.push('/home')
      }
    } catch (error: any) {
      setError(error?.message || "Invalid email or password")
      toast({
        title: 'Error',
        description: error?.message || "Invalid email or password",
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClientComponentClient()

      const { error: updateError } = await supabase
        .from('users')
        .update({
          firstname: profileData.firstname,
          lastname: profileData.lastname,
          phone: profileData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      if (updateError) throw updateError

      toast({
        title: 'Profile updated',
        description: 'Your profile has been completed successfully.',
      })

      router.push('/home')
    } catch (error: any) {
      setError(error?.message || "Failed to update profile")
      toast({
        title: 'Error',
        description: error?.message || "Failed to update profile",
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (['firstname', 'lastname', 'phone'].includes(name)) {
      setProfileData(prev => ({ ...prev, [name]: value }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  if (showProfileForm) {
    return (
      <div className="flex flex-col items-center space-y-6 w-full max-w-md">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>
              Please provide your details to continue
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleProfileSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  name="firstname"
                  placeholder="Enter your first name"
                  value={profileData.firstname}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  placeholder="Enter your last name"
                  value={profileData.lastname}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>

              {error && (
                <div className="text-sm text-red-500 text-center">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Complete Profile"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-md">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Welcome Back!</h1>
        <p className="text-muted-foreground">
          Sign in to continue your training journey
        </p>
      </div>

      <Card className="w-full">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  className="h-11"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-500 text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <Link
              href="/auth/sign-up"
              className="text-primary hover:underline"
            >
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}