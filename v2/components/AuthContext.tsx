// @ts-nocheck
'use client'

import React, { createContext, useContext } from 'react'
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useFirebaseAuth()

  return (
    <AuthContext.Provider value={auth}>
      {!auth.loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)