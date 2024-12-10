export type UserRole = 'admin' | 'instructor' | 'student'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          firstname: string | null
          lastname: string | null
          email: string | null
          phone: string | null
          role: UserRole
          created_at: string
          last_sign_in_at: string | null
          is_anonymous: boolean
          auth_provider: string | null
        }
        Insert: {
          id?: string
          firstname?: string | null
          lastname?: string | null
          email?: string | null
          phone?: string | null
          role?: UserRole
          created_at?: string
          last_sign_in_at?: string | null
          is_anonymous?: boolean
          auth_provider?: string | null
        }
        Update: {
          firstname?: string | null
          lastname?: string | null
          email?: string | null
          phone?: string | null
          role?: UserRole
          last_sign_in_at?: string | null
          is_anonymous?: boolean
          auth_provider?: string | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type UserProfile = Database['public']['Tables']['users']['Row']
export type NewUserProfile = Database['public']['Tables']['users']['Insert']
export type UpdateUserProfile = Database['public']['Tables']['users']['Update']
