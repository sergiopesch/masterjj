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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, profileSchema, type LoginFormData, type ProfileFormData } from "@/lib/validations/auth"
import { checkRateLimit } from "@/lib/rate-limiter"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

interface LoginState {
  isLoading: boolean;
  error: string;
  showProfileForm: boolean;
  userId: string;
}

type LoginAction =
  | { type: 'START_LOADING' }
  | { type: 'STOP_LOADING' }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'SET_SHOW_PROFILE'; value: boolean }
  | { type: 'SET_USER_ID'; id: string }
  | { type: 'RESET_FORM' };

const loginReducer = (state: LoginState, action: LoginAction): LoginState => {
  switch (action.type) {
    case 'START_LOADING':
      return { ...state, isLoading: true, error: '' };
    case 'STOP_LOADING':
      return { ...state, isLoading: false };
    case 'SET_ERROR':
      return { ...state, error: action.error, isLoading: false };
    case 'SET_SHOW_PROFILE':
      return { ...state, showProfileForm: action.value };
    case 'SET_USER_ID':
      return { ...state, userId: action.id };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
};

const initialState: LoginState = {
  isLoading: false,
  error: '',
  showProfileForm: false,
  userId: '',
};

export function LoginForm() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [state, dispatch] = React.useReducer(loginReducer, initialState)

  const handleSignInWithGoogle = async () => {
    try {
      dispatch({ type: 'START_LOADING' })
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: 'Error signing in with Google' })
      toast({
        title: "Error",
        description: "There was a problem signing in with Google",
        variant: "destructive",
      })
    } finally {
      dispatch({ type: 'STOP_LOADING' })
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        <CardDescription>
          Continue with Google to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          type="button"
          disabled={state.isLoading}
          className="w-full"
          onClick={handleSignInWithGoogle}
        >
          <span className="mr-2 inline-flex h-4 w-4 items-center justify-center">
            {state.isLoading ? (
              <Icons.spinner className="h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="h-4 w-4" />
            )}
          </span>
          Continue with Google
        </Button>
      </CardContent>
    </Card>
  )
}