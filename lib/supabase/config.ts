import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Make sure to add this to your .env
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export const emailConfig = {
  brandColor: '#4F46E5', // Your brand color
  brandLogo: 'https://your-domain.com/logo.png', // Add your logo URL
  brandName: 'MasterJJ',
  redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '',
  emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '',
}
