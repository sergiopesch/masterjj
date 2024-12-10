'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type ErrorCode = 'missing_code' | 'invalid_session' | 'missing_user' | 'profile_error' | 'profile_creation_failed' | 'unexpected_error'

const errorMessages: Record<ErrorCode, { title: string; message: string }> = {
  missing_code: {
    title: 'Authentication Code Missing',
    message: 'The authentication code was not provided. Please try signing in again.',
  },
  invalid_session: {
    title: 'Invalid Session',
    message: 'We could not create a valid session. Please try signing in again.',
  },
  missing_user: {
    title: 'User Not Found',
    message: 'We could not find your user information. Please try signing in again.',
  },
  profile_error: {
    title: 'Profile Error',
    message: 'There was an error accessing your profile. Please try again later.',
  },
  profile_creation_failed: {
    title: 'Profile Creation Failed',
    message: 'We could not create your profile. Please try signing in again.',
  },
  unexpected_error: {
    title: 'Unexpected Error',
    message: 'An unexpected error occurred. Please try again later.',
  },
}

export default function AuthError() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const errorParam = searchParams.get('error')
  const errorCode = (errorParam as ErrorCode) || 'unexpected_error'
  
  // Ensure the error code exists in our messages, fallback to unexpected_error if not
  const safeErrorCode: ErrorCode = errorMessages.hasOwnProperty(errorCode) ? errorCode : 'unexpected_error'
  const errorInfo = errorMessages[safeErrorCode]

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-destructive">
            {errorInfo.title}
          </CardTitle>
          <CardDescription>
            {errorInfo.message}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            onClick={() => router.push('/auth/sign-in')}
            className="w-full"
          >
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="w-full"
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
