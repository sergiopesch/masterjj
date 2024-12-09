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
        }
        Insert: {
          firstname?: string | null
          lastname?: string | null
          email?: string | null
          phone?: string | null
          role?: UserRole
        }
        Update: {
          firstname?: string | null
          lastname?: string | null
          email?: string | null
          phone?: string | null
          role?: UserRole
        }
      }
    }
  }
}

export type UserProfile = Database['public']['Tables']['users']['Row']
export type NewUserProfile = Database['public']['Tables']['users']['Insert']
export type UpdateUserProfile = Database['public']['Tables']['users']['Update']
