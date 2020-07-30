import { useNavigate } from "react-router-dom"
import config from "config/kratos"
import { useCallback } from "react"

export const LSK_IS_AUTHENTICATED = "isAuthenticated"

export const LSK_IS_AUTHENTICATED_REFERER = "isAuthenticated.referer"

export const getAuthenticatedReferer = () => localStorage.getItem(LSK_IS_AUTHENTICATED_REFERER)

export const setAuthenticatedReferer = (location: string) => localStorage.setItem(LSK_IS_AUTHENTICATED_REFERER, location)

export const unsetAuthenticatedReferer = () => localStorage.removeItem(LSK_IS_AUTHENTICATED_REFERER)

export const isAuthenticated = () => localStorage.getItem(LSK_IS_AUTHENTICATED) === "true"

export const setAuthenticated = () => localStorage.setItem(LSK_IS_AUTHENTICATED, "true")

export const unsetAuthenticated = () => localStorage.removeItem(LSK_IS_AUTHENTICATED)

export const useAuth = () => {
  const navigate = useNavigate()
  const { pathname } = window.location

  const login = useCallback(() => {
    navigate(config.routes.login.path)
    setAuthenticatedReferer(pathname)
  // eslint-disable-next-line
  }, [])

  const register = useCallback(() => {
    navigate(config.routes.registration.path)
    setAuthenticatedReferer(pathname)
  // eslint-disable-next-line
  }, [])

  const logout = useCallback(() => {
    const base = config.kratos.browser
    unsetAuthenticated()
    window.location.href = `${base}/self-service/browser/flows/logout`
  // eslint-disable-next-line
  }, [])

  const refresh = useCallback(() => {
    const base = config.kratos.browser
    unsetAuthenticated()
    window.location.href = `${base}/self-service/browser/flows/login?refresh=true&return_to=${config.baseUrl}/callback`
  // eslint-disable-next-line 
  }, [])

  return {
    login,
    register,
    logout,
    refresh,
    isAuthenticated
  }
}
