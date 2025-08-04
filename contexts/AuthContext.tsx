import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const mockUsers: Record<string, User & { password: string }> = {
  'user@example.com': {
    id: '1',
    name: 'Andi Susanto',
    email: 'user@example.com',
    phone: '+62 812-3456-7890',
    role: 'user',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    location: 'Jl. Tadulako No. 123, Palu Barat, Sulawesi Tengah',
    password: 'password123',
  },
  'tukang@example.com': {
    id: '2',
    name: 'Pak Budi Santoso',
    email: 'tukang@example.com',
    phone: '+62 812-9876-5432',
    role: 'tukang',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    location: 'Palu Barat, Sulawesi Tengah',
    category: 'Tukang Listrik',
    rating: 4.8,
    reviews: 127,
    price: 75000,
    experience: '15 tahun',
    description: 'Pengalaman 15 tahun dalam bidang instalasi listrik rumah dan komersial.',
    services: ['Instalasi Listrik', 'Perbaikan Korsleting', 'Pemasangan Lampu', 'Panel Listrik'],
    password: 'password123',
  },
  'admin@example.com': {
    id: '3',
    name: 'Admin Tukangku',
    email: 'admin@example.com',
    phone: '+62 812-1111-2222',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    permissions: ['manage_users', 'manage_bookings', 'view_analytics'],
    password: 'admin123',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const checkStoredSession = async () => {
      try {
        // In a real app, this would check AsyncStorage or secure storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking stored session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStoredSession();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userData = mockUsers[email];
    if (!userData || userData.password !== password) {
      setIsLoading(false);
      throw new Error('Email atau password salah');
    }

    const { password: _, ...userWithoutPassword } = userData;
    setUser(userWithoutPassword);
    
    // Store session
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    setIsLoading(false);
  };

  const register = async (userData: Partial<User>, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (mockUsers[userData.email!]) {
      setIsLoading(false);
      throw new Error('Email sudah terdaftar');
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name!,
      email: userData.email!,
      phone: userData.phone!,
      role: userData.role || 'user',
      avatar: userData.avatar,
      location: userData.location,
      category: userData.category,
      rating: userData.rating,
      reviews: userData.reviews,
      price: userData.price,
      experience: userData.experience,
      description: userData.description,
      services: userData.services,
      permissions: userData.permissions,
    };

    // Add to mock database
    mockUsers[userData.email!] = { ...newUser, password };
    
    setUser(newUser);
    
    // Store session
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
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