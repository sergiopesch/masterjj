'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const errorMessages = {
  code: 'Invalid or expired magic link. Please request a new one.',
  session: 'Unable to create your session. Please try signing in again.',
  profile: 'Unable to retrieve your profile. Please contact support.',
  callback: 'Something went wrong. Please try signing in again.',
  default: 'An unexpected error occurred. Please try again.',
}

export default function AuthCallbackError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const errorMessage = error ? errorMessages[error as keyof typeof errorMessages] : errorMessages.default

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-red-600">Authentication Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">{errorMessage}</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/auth/sign-in">Try Again</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
