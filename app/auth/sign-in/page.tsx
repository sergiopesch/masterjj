'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"
import { Icons } from "@/components/ui/icons"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  async function signInWithGoogle() {
    try {
      setIsLoading(true)
      
      // Get the current URL for the redirect
      const redirectUrl = `${window.location.origin}/auth/callback`
      console.log('Starting Google sign in...')
      console.log('Redirect URL:', redirectUrl)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          skipBrowserRedirect: true,
          scopes: 'email profile',
        },
      })

      if (error) {
        console.error('Error signing in with Google:', error)
        toast.error("Failed to sign in with Google. Please try again.")
        return
      }

      if (data?.url) {
        console.log('OAuth URL:', data.url)
        window.location.href = data.url
      }
    } catch (error: any) {
      console.error('Unexpected error:', error)
      toast.error(error.message || "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            onClick={signInWithGoogle}
            className="w-full"
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
