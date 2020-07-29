export const BASE_URL = "http://127.0.0.1:4455"
export const KRATOS_BROWSER_URL = "http://127.0.0.1:4455/.ory/kratos/public"
export const KRATOS_PUBLIC_URL = "http://127.0.0.1:4455/.ory/kratos/public"
export const KRATOS_ADMIN_URL = "http://127.0.0.1:4434"

export default {
  kratos: {
    browser: KRATOS_BROWSER_URL,
    admin: KRATOS_ADMIN_URL,
    public: KRATOS_PUBLIC_URL,
  },
  baseUrl: BASE_URL,
  projectName: "SecureApp",
  routes: {
    settings: {
      path: "/settings"
    },
    recovery: {
      path: "/recovery"
    },
    verification: {
      path: "/verify"
    },
    login: {
      path: "/auth/login"
    },
    registration: {
      path: "/auth/registration"
    }
  }
}
