import { useEffect, useState } from 'react'
import { authService, clearAccessToken, getAccessToken } from '@/services'
import type { LoginPayload, User } from '@/types/api'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isBooting, setIsBooting] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function boot() {
      if (!getAccessToken()) {
        setIsBooting(false)
        return
      }

      try {
        const currentUser = await authService.me()
        if (isMounted) {
          setUser(currentUser)
        }
      } catch {
        clearAccessToken()
      } finally {
        if (isMounted) {
          setIsBooting(false)
        }
      }
    }

    boot()

    return () => {
      isMounted = false
    }
  }, [])

  async function login(payload: LoginPayload) {
    setIsLoading(true)
    setError(null)

    try {
      const data = await authService.login(payload)
      setUser(data.user)
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Login gagal.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  async function logout() {
    setIsLoading(true)
    setError(null)

    try {
      await authService.logout()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isAuthenticated: Boolean(user),
    isBooting,
    isLoading,
    error,
    login,
    logout,
  }
}
