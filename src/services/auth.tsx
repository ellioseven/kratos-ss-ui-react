import config from "config/kratos"

export const LSK_IS_AUTHENTICATED = "kratos.isAuthenticated"

export const LSK_IS_AUTHENTICATED_REFERER = "kratos.referer"

export const getAuthenticatedReferer = () => localStorage.getItem(LSK_IS_AUTHENTICATED_REFERER)

export const setAuthenticatedReferer = (location: string) => localStorage.setItem(LSK_IS_AUTHENTICATED_REFERER, location)

export const unsetAuthenticatedReferer = () => localStorage.removeItem(LSK_IS_AUTHENTICATED_REFERER)

export const isAuthenticated = () => localStorage.getItem(LSK_IS_AUTHENTICATED) === "true"

export const setAuthenticated = () => localStorage.setItem(LSK_IS_AUTHENTICATED, "true")

export const unsetAuthenticated = () => localStorage.removeItem(LSK_IS_AUTHENTICATED)

export const login = ({ setReferer = true } = {}) => {
  const { pathname } = window.location
  if (setReferer) setAuthenticatedReferer(pathname)
  window.location.href = config.routes.login.path
}

export const register = ({ setReferer = true } = {}) => {
  const { pathname } = window.location
  if (setReferer) setAuthenticatedReferer(pathname)
  window.location.href = config.routes.registration.path
}

export const logout = () => {
  const base = config.kratos.browser
  unsetAuthenticated()
  window.location.href = `${base}/self-service/browser/flows/logout`
}

export const refresh = () => {
  const base = config.kratos.browser
  unsetAuthenticated()
  window.location.href = `${base}/self-service/browser/flows/login?refresh=true&return_to=${config.baseUrl}/callback`
}
