import { useEffect } from "react"
import { PublicApi } from "@oryd/kratos-client"
import config from "config/kratos"
import { setAuthenticated, unsetAuthenticated, unsetAuthenticatedReferer, getAuthenticatedReferer } from "services/auth"

const kratos = new PublicApi(config.kratos.public)

export const Callback = () => {
  useEffect(() => {
    kratos.whoami()
      .then(() => {
        setAuthenticated()
        unsetAuthenticatedReferer()
        window.location.href = getAuthenticatedReferer() || "/"
      })
      .catch(error => {
        unsetAuthenticated()
        unsetAuthenticatedReferer()
        console.log(error)
      })
  }, [])

  return null
}
