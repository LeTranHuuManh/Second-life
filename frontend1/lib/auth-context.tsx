'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type UserRole = 'guest' | 'user' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate checking stored user session
    const stored = localStorage.getItem('marketplace-user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        setUser(null)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newUser: User = {
      id: Math.random().toString(),
      email,
      name: email.split('@')[0],
      role: 'user',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    }
    
    setUser(newUser)
    localStorage.setItem('marketplace-user', JSON.stringify(newUser))
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('marketplace-user')
  }

  const setRole = (role: UserRole) => {
    if (user) {
      const updated = { ...user, role }
      setUser(updated)
      if (role !== 'guest') {
        localStorage.setItem('marketplace-user', JSON.stringify(updated))
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, setRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
