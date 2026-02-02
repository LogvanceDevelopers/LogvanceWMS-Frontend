import { useState, useCallback, useEffect } from 'react'
import { authApi, LoginRequest, AuthResponse } from '../api/auth'

interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('token')
  })
  const [user, setUser] = useState<User | null>(() => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (data: LoginRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const response: AuthResponse = await authApi.login(data)
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      setUser(response.user)
      setIsAuthenticated(true)
      
      // Sayfa yönlendirmesi - Dashboard'a git
      window.location.href = '/'
      
      return response
    } catch (err: any) {
      console.error('Login error:', err)
      const message = err.response?.data?.message || err.response?.data?.Message || err.message || 'Giriş başarısız. Lütfen kullanıcı adı ve şifrenizi kontrol edin.'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    // localStorage'ı temizle
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // State'i güncelle
    setUser(null)
    setIsAuthenticated(false)
    
    // Login sayfasına yönlendir
    window.location.href = '/login'
  }, [])

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setIsAuthenticated(false)
      setUser(null)
    }
  }, [])

  return {
    isAuthenticated,
    user,
    isLoading,
    error,
    login,
    logout,
  }
}
