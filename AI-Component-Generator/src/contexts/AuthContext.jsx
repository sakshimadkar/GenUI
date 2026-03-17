import React, { createContext, useContext, useEffect, useState } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getCurrentUser())

  useEffect(() => {
    setUser(authService.getCurrentUser())
  }, [])

  const register = async (data) => {
    const res = await authService.register(data)
    if (res.success) setUser(res.user)
    return res
  }

  const login = async (data) => {
    const res = await authService.login(data)
    if (res.success) setUser(res.user)
    return res
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export default AuthContext