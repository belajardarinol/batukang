import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

export type UserRole = 'user' | 'tukang' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  location?: string;
  // Tukang specific fields
  category?: string;
  rating?: number;
  reviews?: number;
  price?: number;
  experience?: string;
  description?: string;
  services?: string[];
  // Admin specific fields
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (profile) {
        // If user is a tukang, fetch worker details
        if (profile.role === 'tukang') {
          const { data: worker } = await supabase
            .from('workers')
            .select('*')
            .eq('user_id', userId)
            .single();

          if (worker) {
            setUser({
              ...profile,
              category: worker.category,
              rating: worker.rating,
              reviews: worker.reviews_count,
              price: worker.price,
              experience: worker.experience,
              description: worker.description,
              services: worker.services,
            });
          } else {
            setUser(profile);
          }
        } else {
          setUser(profile);
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await loadUserProfile(data.user.id);
      }
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.message || 'Email atau password salah');
    }
  };

  const register = async (userData: Partial<User>, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email!,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: userData.email!,
          name: userData.name!,
          phone: userData.phone!,
          role: userData.role || 'user',
          avatar: userData.avatar || null,
          location: userData.location || null,
        });

      if (profileError) throw profileError;

      // If registering as tukang, create worker profile
      if (userData.role === 'tukang') {
        const { error: workerError } = await supabase
          .from('workers')
          .insert({
            user_id: authData.user.id,
            category: userData.category!,
            price: userData.price!,
            experience: userData.experience!,
            description: userData.description!,
            services: userData.services!,
          });

        if (workerError) throw workerError;
      }

      await loadUserProfile(authData.user.id);
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.message || 'Gagal mendaftar');
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}