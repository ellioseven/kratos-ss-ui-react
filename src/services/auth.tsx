import { useNavigate } from "react-router-dom"
import config from "config/kratos"

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

  const login = () => {
    navigate(config.routes.login.path)
    setAuthenticatedReferer(pathname)
  }

  const register = () => {
    navigate(config.routes.registration.path)
    setAuthenticatedReferer(pathname)
  }

  const logout = () => {
    const base = config.kratos.browser
    unsetAuthenticated()
    window.location.href = `${base}/self-service/browser/flows/logout`
  }

  return {
    login,
    register,
    logout,
    isAuthenticated
  }
}
