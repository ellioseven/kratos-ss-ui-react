// @todo Verify
// @todo Profile
// @todo Clean up config
// @todo Merge auth/identity
// @todo Refresh session.

import React, { useEffect, useState, useContext, createContext } from "react"
import { Identity, LoginRequest, PublicApi, RegistrationRequest, SettingsRequest } from "@oryd/kratos-client"
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom"
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

const useAuth = () => {
  const navigate = useNavigate()
  const { pathname } = window.location

  const login = () => {
    navigate("/auth/login")
    setAuthenticatedReferer(pathname)
  }

  const register = () => {
    navigate("/auth/registration")
    setAuthenticatedReferer(pathname)
  }

  const logout = () => {
    const base = config.kratos.browser
    unsetAuthenticated()
    window.location.href = `${base}/self-service/browser/flows/logout`
  }

  return { login, register, logout }
}

const initialIdentity: Identity = {
  id: "",
  schemaId: "",
  schemaUrl: "",
  traits: {},
  verifiableAddresses: [],
  recoveryAddresses: []
}

const LSK_IS_AUTHENTICATED = "isAuthenticated"

const LSK_IS_AUTHENTICATED_REFERER = "isAuthenticated.referer"

const IdentityContext = createContext({
  identity: initialIdentity
})

const useIdentity = () => useContext(IdentityContext)

const getAuthenticatedReferer = () => localStorage.getItem(LSK_IS_AUTHENTICATED_REFERER)

const setAuthenticatedReferer = (location: string) => localStorage.setItem(LSK_IS_AUTHENTICATED_REFERER, location)

const unsetAuthenticatedReferer = () => localStorage.removeItem(LSK_IS_AUTHENTICATED_REFERER)

const isAuthenticated = () => localStorage.getItem(LSK_IS_AUTHENTICATED) === "true"

const setAuthenticated = () => localStorage.setItem(LSK_IS_AUTHENTICATED, "true")

const unsetAuthenticated = () => localStorage.removeItem(LSK_IS_AUTHENTICATED)

const IdentityProvider: React.FunctionComponent = ({ children }) => {
  const [identity, setIdentity] = useState(initialIdentity)

  useEffect(() => {
    isAuthenticated() && kratos.whoami()
      .then(({ body }) => {
        setIdentity(body.identity)
      })
      .catch(error => {
        unsetAuthenticated()
        console.log(error)
      })
  }, [])

  const context = { identity }

  return (
    <IdentityContext.Provider value={ context }>
      { children }
    </IdentityContext.Provider>
  )
}

const redirectToFlow = ({ type }: { type: string }) => {
  window.location.href = `${ config.kratos.browser }/self-service/browser/flows/${ type }?return_to=${config.baseUrl}/callback`
}

const authHandler = ({ type  }: { type: "login" | "registration" | "settings" }) : Promise<LoginRequest | RegistrationRequest | SettingsRequest> => {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams(window.location.search)
    const request = params.get("request") || ""

    // Ensure request exists in params.
    if (!request) return redirectToFlow({ type })

    let authRequest: Promise<any> | undefined
    if (type === "login") authRequest = kratos.getSelfServiceBrowserLoginRequest(request)
    else if (type === "registration") authRequest = kratos.getSelfServiceBrowserRegistrationRequest(request)
    else if (type === "settings") authRequest = kratos.getSelfServiceBrowserSettingsRequest(request)

    if (!authRequest) return reject()

    authRequest.then(({ body, response }) => {
      console.log(body, response)
      if (response.statusCode !== 200) return reject(body)
      resolve(body)
    }).catch(error => {
      console.log(error)
      return redirectToFlow({ type })
    })
  })
}

const AuthMenu = () => {
  const { login, register, logout } = useAuth()

  let menu
  if (isAuthenticated()) {
    menu = (
      <React.Fragment>
        <Link to="/settings">Settings</Link>
        <button onClick={ logout }>Logout</button>
      </React.Fragment>
    )
  } else {
    menu = (
      <React.Fragment>
        <button onClick={ login }>Login</button>
        <button onClick={ register }>Register</button>
      </React.Fragment>
    )
  }

  return (
    <div className="auth-menu">
      { menu }
    </div>
  )
}

const Auth = ({ type }: ({ type: "login" | "registration" | "settings" })) => {
  const [requestResponse, setRequestResponse] = useState<LoginRequest | RegistrationRequest | SettingsRequest>()

  useEffect(() => {
    authHandler({ type })
      .then(request => setRequestResponse(request))
      .catch(error => console.log(error))
  }, [type])

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
      <AuthMenu />
      { messages.map(({ text }) => <p key={ text }>{ text }</p>) }
      { action &&
        <form action={ action } style={ { margin: "60px 0" } } method="POST">
          { fieldDisplay }
          <input type="submit" value="Register"/>
        </form> }
    </React.Fragment>
  )
}

const Callback = () => {
  const returnLocation = getAuthenticatedReferer() || "/"

  useEffect(() => {
    kratos.whoami()
      .then(({ body }) => {
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

const Dashboard = () => {
  const identity = useIdentity()

  return (
    <React.Fragment>
      <AuthMenu />
      <pre style={ { textAlign: "left" } }>
        { JSON.stringify(identity.identity.traits, null, "\t") }
      </pre>
    </React.Fragment>
  )
}

function App() {
  return (
    <div className="App">
      <IdentityProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={ <Dashboard /> } />
            <Route path="/callback" element={ <Callback /> } />
            <Route path="/auth/login" element={ <Auth type="login" /> } />
            <Route path="/settings" element={ <Auth type="settings" /> } />
            <Route path="/auth/registration" element={ <Auth type="registration" /> } />
          </Routes>
        </BrowserRouter>
      </IdentityProvider>
    </div>
  )
}

export default App
