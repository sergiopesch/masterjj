"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Timer, ArrowLeft, ArrowRight } from "lucide-react"
import type { NewUserProfile } from "@/lib/types/database"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'

type Step = 'user-info' | 'email-verification'

interface UserInfo {
  firstname: string
  lastname: string
  phone: string
  email: string
  role: 'student' | 'instructor'
}

export function SignUpForm() {
  const router = useRouter()
  const [step, setStep] = React.useState<Step>('user-info')
  const [userInfo, setUserInfo] = React.useState<UserInfo>({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    role: 'student',
  })
  const [error, setError] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSent, setIsSent] = React.useState(false)
  const [resendTimer, setResendTimer] = React.useState(0)

  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  const validateForm = () => {
    if (!userInfo.firstname.trim()) return "First name is required"
    if (!userInfo.lastname.trim()) return "Last name is required"
    if (!userInfo.phone.trim()) return "Phone number is required"
    if (!userInfo.email.trim()) return "Email is required"
    if (!userInfo.email.includes('@')) return "Invalid email format"
    return ""
  }

  const handleUserInfoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClientComponentClient()
      
      // First, create the user with OTP
      const { error: signUpError } = await supabase.auth.signInWithOtp({
        email: userInfo.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            firstname: userInfo.firstname,
            lastname: userInfo.lastname,
            phone: userInfo.phone,
            role: userInfo.role,
          },
        },
      })

      if (signUpError) {
        throw signUpError
      }

      // Store user info in users table
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            email: userInfo.email,
            firstname: userInfo.firstname,
            lastname: userInfo.lastname,
            phone: userInfo.phone,
            role: userInfo.role,
          },
        ])

      if (profileError) {
        throw profileError
      }

      setIsSent(true)
      setResendTimer(60)
      setStep('email-verification')
      toast({
        title: 'Check your email',
        description: 'We sent you a magic link to complete your sign up.',
      })
    } catch (error: any) {
      setError(error?.message || "An error occurred. Please try again.")
      setStep('user-info')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return
    setIsLoading(true)
    setError("")

    try {
      const supabase = createClientComponentClient()
      const { error: resendError } = await supabase.auth.signInWithOtp({
        email: userInfo.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (resendError) {
        throw resendError
      }

      setResendTimer(60)
    } catch (error: any) {
      setError(error?.message || "Failed to resend email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: 'student' | 'instructor') => {
    setUserInfo((prev) => ({ ...prev, role: value }))
  }

  if (step === 'user-info') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Join MasterJJ</CardTitle>
          <CardDescription className="text-center">
            Enter your details to begin your BJJ journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUserInfoSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                name="firstname"
                placeholder="First Name"
                value={userInfo.firstname || ''}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className="h-11"
                autoFocus
              />
              <Input
                name="lastname"
                placeholder="Last Name"
                value={userInfo.lastname || ''}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className="h-11"
              />
              <Input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={userInfo.phone || ''}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className="h-11"
              />
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={userInfo.email || ''}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className="h-11"
                autoComplete="email"
              />
              <Select
                name="role"
                value={userInfo.role}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && (
              <div className="text-sm text-red-500 text-center">{error}</div>
            )}
            <Button 
              className="w-full h-11" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : (
                <span className="flex items-center gap-2">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link 
              href="/auth/sign-in" 
              className="text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Verify Your Email</CardTitle>
        <CardDescription className="text-center">
          {!isSent 
            ? "Sending verification email..." 
            : "Check your email to continue"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSent && (
          <div className="text-center space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                We've sent a magic link to <strong>{userInfo.email}</strong>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Click the link in the email to verify your account and begin your training journey.
              </p>
            </div>
            
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleResend}
                disabled={resendTimer > 0 || isLoading}
              >
                {resendTimer > 0 ? (
                  <span className="flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    Resend in {resendTimer}s
                  </span>
                ) : (
                  "Resend magic link"
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => {
                  setStep('user-info')
                  setIsSent(false)
                  setResendTimer(0)
                }}
              >
                <span className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to sign up
                </span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
