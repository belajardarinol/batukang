export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          phone: string
          role: 'user' | 'tukang' | 'admin'
          avatar: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          phone: string
          role?: 'user' | 'tukang' | 'admin'
          avatar?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string
          role?: 'user' | 'tukang' | 'admin'
          avatar?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workers: {
        Row: {
          id: string
          user_id: string
          category: string
          rating: number
          reviews_count: number
          price: number
          experience: string
          description: string
          services: string[]
          working_hours: string
          completed_jobs: number
          response_time: string
          available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          rating?: number
          reviews_count?: number
          price: number
          experience: string
          description: string
          services: string[]
          working_hours?: string
          completed_jobs?: number
          response_time?: string
          available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          rating?: number
          reviews_count?: number
          price?: number
          experience?: string
          description?: string
          services?: string[]
          working_hours?: string
          completed_jobs?: number
          response_time?: string
          available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          worker_id: string
          date: string
          time: string
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          total_price: number
          duration: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          worker_id: string
          date: string
          time: string
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          total_price: number
          duration: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          worker_id?: string
          date?: string
          time?: string
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          total_price?: number
          duration?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          worker_id: string
          user_id: string
          booking_id: string
          rating: number
          comment: string
          created_at: string
        }
        Insert: {
          id?: string
          worker_id: string
          user_id: string
          booking_id: string
          rating: number
          comment: string
          created_at?: string
        }
        Update: {
          id?: string
          worker_id?: string
          user_id?: string
          booking_id?: string
          rating?: number
          comment?: string
          created_at?: string
        }
      }
      gallery: {
        Row: {
          id: string
          worker_id: string
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          worker_id: string
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          worker_id?: string
          image_url?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
