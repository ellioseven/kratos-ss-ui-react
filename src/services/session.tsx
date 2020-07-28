import React, { createContext, useContext, useEffect, useState } from "react"
import { PublicApi, Session } from "@oryd/kratos-client"
import { isAuthenticated , unsetAuthenticated } from "services/auth"
import config from "config/kratos"

const kratos = new PublicApi(config.kratos.public)

const SessionContext = createContext(
  new Session()
)

export const useSession = () => useContext(SessionContext)

export const SessionProvider: React.FunctionComponent = ({ children }) => {
  const [session, setSession] = useState(
    new Session()
  )

  useEffect(() => {
    isAuthenticated() && kratos.whoami()
      .then(({ body }) => {
        setSession(body)
      })
      .catch(error => {
        unsetAuthenticated()
        console.log(error)
      })
  }, [])

  return (
    <SessionContext.Provider value={ session }>
      { children }
    </SessionContext.Provider>
  )
}
