import { useEffect } from "react"
import { getAuthenticatedReferer } from "services/auth"
import { PublicApi } from "@oryd/kratos-client"
import config from "config/kratos"
import { setAuthenticated, unsetAuthenticated, unsetAuthenticatedReferer } from "services/auth"

const kratos = new PublicApi(config.kratos.public)

export const Callback = () => {
  const returnLocation = getAuthenticatedReferer() || "/"

  useEffect(() => {
    kratos.whoami()
      .then(() => {
        setAuthenticated()
        unsetAuthenticatedReferer()
        window.location.href = returnLocation
      })
      .catch(error => {
        unsetAuthenticated()
        console.log(error)
      })
  }, [returnLocation])

  return null
}
