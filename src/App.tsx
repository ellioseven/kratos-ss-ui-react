import React, { useEffect, useState } from "react"
import { LoginRequest, PublicApi, RegistrationRequest, Session } from "@oryd/kratos-client"
import "./App.css"
import config from "./config"

const kratos = new PublicApi(config.kratos.public)

interface FormLabel {
  label: string;
  priority: number;
}

const FORM_LABELS: { [key: string]: FormLabel } = {
  "traits.email": {
    label: "Email",
    priority: 100,
  },
  identifier: {
    label: "Email",
    priority: 90
  },
  "to_verify": {
    label: "Email",
    priority: 80
  },
  password: {
    label: "Password",
    priority: 70
  }
}

const redirectToFlow = ({ type }: { type: String }) => {
  window.location.href = `${ config.kratos.browser }/self-service/browser/flows/${ type }`
}

const authHandler = ({ type  }: { type: "login" | "registration" }) : Promise<LoginRequest | RegistrationRequest> => {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams(window.location.search)
    const request = params.get("request") || ""

    // Ensure request exists in params.
    if (!request) return redirectToFlow({ type })

    const authRequest = type === "login"
      ? kratos.getSelfServiceBrowserLoginRequest(request)
      : kratos.getSelfServiceBrowserRegistrationRequest(request)

    authRequest.then(({ body, response }) => {
      if (response.statusCode !== 200) reject(body)
      resolve(body)
    }).catch(error => {
      return redirectToFlow({ type })
    })
  })
}

const Auth = ({ type }: ({ type: "login" | "registration" })) => {
  const [requestResponse, setRequestResponse] = useState<LoginRequest | RegistrationRequest>()

  useEffect(() => {
    if (type === "login") {
      kratos.initializeSelfServiceBrowserLoginFlow(true)
        .catch(error => console.log(error))
    }
    // authHandler({ type })
    //   .then(request => setRequestResponse(request))
    //   .catch(error => console.log(error))
  }, [type])

  // @todo Check for `oidc` method.
  const config = requestResponse?.methods?.password?.config

  if (!config) return null

  const { action, fields = [], messages = [] } = config

  // Fields need to be sorted by priority.
  const fieldsSorted = fields.sort((current, next) => {
    const c = FORM_LABELS[current.name]?.priority || 0
    const n = FORM_LABELS[next.name]?.priority || 0
    return n - c
  })

  const fieldDisplay = fieldsSorted.map(({ name, type, required, value, messages = [] }) => {
    const _required = required ? { required } : {}
    return (
      <React.Fragment key={ name }>
        { FORM_LABELS[name]?.label && <p><label>{ FORM_LABELS[name]?.label }</label></p> }
        <input type={ type } name={ name } defaultValue={ value as any } { ..._required } />
        <p>{ messages.map(({ text }) => text) }</p>
      </React.Fragment>
    )
  })

  return (
    <React.Fragment>
      { type === "registration" && <a href="/auth/login">Login</a> }
      { type === "login" && <a href="/auth/registration">Register</a> }
      { messages.map(({ text }) => <p key={ text }>{ text }</p>) }
      { action &&
        <form action={ action } style={ { margin: "60px 0" } } method="POST">
          { fieldDisplay }
          <input type="submit" value="Register"/>
        </form> }
    </React.Fragment>
  )
}

const Profile = () => {
  const [profile, setProfile] = useState<Session>()

  useEffect(() => {
    kratos.whoami()
      .then(({ body }) => setProfile(body))
  }, [])

  const display = profile?.identity?.traits || {}

  return (
    <pre style={ { textAlign: "left" } }>
      { JSON.stringify(display, null, "\t") }
    </pre>
  )
}

function App() {
  const { pathname } = window.location
  return (
    <div className="App">
      { pathname === "/" && <Profile/> }
      { pathname === "/auth/login" && <Auth type="login" /> }
      { pathname === "/auth/registration" && <Auth type="registration" /> }
    </div>
  )
}

export default App
