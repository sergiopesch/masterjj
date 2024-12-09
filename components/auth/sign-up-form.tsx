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
import { createClient } from "@/lib/supabase/client"

export function SignUpForm() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [error, setError] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSent, setIsSent] = React.useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      } else {
        setIsSent(true)
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
        <CardDescription className="text-center">
          {!isSent ? "Enter your email to create an account" : "Check your email"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isSent ? (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                suppressHydrationWarning
              />
            </div>
            {error && (
              <div className="text-sm text-red-500 text-center">{error}</div>
            )}
            <Button 
              className="w-full" 
              type="submit" 
              disabled={isLoading}
              suppressHydrationWarning
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              We've sent a magic link to <strong>{email}</strong>. 
              Click the link in the email to verify your account and sign in.
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setEmail("")
                setIsSent(false)
              }}
            >
              Use a different email
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" asChild>
          <Link href="/">← Back to Home</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/auth/sign-in">Sign In →</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
