// @todo Error.
// @todo Clean up config.
// @todo Merge auth/identity
// @todo Refresh session.

import React, { useEffect, useState, useContext, createContext } from "react"
import { FormField, Identity, LoginRequest, Message, PublicApi, RecoveryRequest, RegistrationRequest, SettingsRequest, VerificationRequest } from "@oryd/kratos-client"
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
  email: {
    label: "Email",
    priority: 90
  },
  identifier: {
    label: "Email",
    priority: 90
  },
  "to_verify": {
    label: "Email",
    priority: 90
  },
  password: {
    label: "Password",
    priority: 80
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

const initialIdentity: Identity = new Identity()

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

const endpoints = {
  login: `${ config.kratos.browser }/self-service/browser/flows/login?return_to=${config.baseUrl}/callback`,
  register: `${ config.kratos.browser }/self-service/browser/flows/registration?return_to=${config.baseUrl}/callback`,
  settings: `${ config.kratos.browser }/self-service/browser/flows/settings`,
  verify: `${config.kratos.public}/self-service/browser/flows/verification/init/email`,
  recover: `${config.kratos.public}/self-service/browser/flows/recovery`
}

const authHandler = ({ type  }: { type: "login" | "register" | "settings" | "verify" | "recover"  }) : Promise<LoginRequest | RegistrationRequest | SettingsRequest | VerificationRequest | RecoveryRequest> => {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams(window.location.search)
    const request = params.get("request") || ""
    const endpoint = endpoints[type]

    // Ensure request exists in params.
    if (!request) return window.location.href = endpoint

    let authRequest: Promise<any> | undefined
    if (type === "login") authRequest = kratos.getSelfServiceBrowserLoginRequest(request)
    else if (type === "register") authRequest = kratos.getSelfServiceBrowserRegistrationRequest(request)
    else if (type === "settings") authRequest = kratos.getSelfServiceBrowserSettingsRequest(request)
    else if (type === "verify") authRequest = kratos.getSelfServiceVerificationRequest(request)
    else if (type === "recover") authRequest = kratos.getSelfServiceBrowserRecoveryRequest(request)

    if (!authRequest) return reject()

    authRequest.then(({ body, response }) => {
      if (response.statusCode !== 200) return reject(body)
      resolve(body)
    }).catch(error => {
      return window.location.href = endpoint
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

const sortFields = ({ fields }: { fields: FormField[]}) => {
  return fields.sort((current, next) => {
    const c = FORM_LABELS[current.name]?.priority || 0
    const n = FORM_LABELS[next.name]?.priority || 0
    return n - c
  })
}

const KratosForm = ({ action, messages = [], fields }: { action: string, messages?: Message[], fields: FormField[] }) => {
  const fieldsSorted = sortFields({ fields })
  return (
    <React.Fragment>
      { messages.map(({ text }) => <p key={ text }>{ text }</p>) }
      { action &&
      <form action={ action } style={ { margin: "60px 0" } } method="POST">
        { renderFormFields({ fields: fieldsSorted })}
        <input type="submit" value="Submit"/>
      </form> }
    </React.Fragment>
  )
}

const renderFormFields = ({ fields = [] }: { fields: FormField[] }) => fields.map(field => {
  const { name, type, required, value, messages = [] } = field
  const _required = required ? { required } : {}
  const _label = FORM_LABELS[name]?.label
  return (
    <React.Fragment key={ name }>
      { _label && <p><label>{ _label }</label></p> }
      <input
        type={ type }
        name={ name }
        defaultValue={ value as any }
        { ..._required } />
      <p>{ messages.map(({ text }) => text) }</p>
    </React.Fragment>
  )
})

const KratosMessages = ({ messages }: { messages: Message[] }) => (
  <React.Fragment>
    { messages.map(({ text, id }) =>
      <p key={ id }>{ text }</p>) }
  </React.Fragment>
)

const Login = () => {
  const [requestResponse, setRequestResponse] = useState<LoginRequest>()

  useEffect(() => {
    const request = authHandler({ type: "login" }) as Promise<LoginRequest>
    request
      .then(request => setRequestResponse(request))
      .catch(() => {})
  }, [setRequestResponse])

  const messages = requestResponse?.messages
  const form = requestResponse?.methods?.password?.config

  return (
    <React.Fragment>
      <AuthMenu />
      { messages && <KratosMessages messages={ messages } /> }
      { form &&
        <KratosForm
          action={ form.action }
          fields={ form.fields }
          messages={ form.messages } /> }
    </React.Fragment>
  )
}

const Register = () => {
  const [requestResponse, setRequestResponse] = useState<RegistrationRequest>()

  useEffect(() => {
    const request = authHandler({ type: "register" }) as Promise<RegistrationRequest>
    request
      .then(request => setRequestResponse(request))
      .catch(() => {})
  }, [setRequestResponse])

  const form = requestResponse?.methods?.password?.config
  const messages = requestResponse?.messages

  return (
    <React.Fragment>
      <AuthMenu />
      { messages && <KratosMessages messages={ messages } /> }
      { form &&
        <KratosForm
          action={ form.action }
          fields={ form.fields }
          messages={ form.messages } /> }
    </React.Fragment>
  )
}

const Settings = () => {
  const [requestResponse, setRequestResponse] = useState<SettingsRequest>()

  useEffect(() => {
    const request = authHandler({ type: "settings" }) as Promise<SettingsRequest>
    request
      .then(request => setRequestResponse(request))
      .catch(() => {})
  }, [setRequestResponse])

  const form = requestResponse?.methods?.password?.config
  const messages = requestResponse?.messages

  return (
    <React.Fragment>
      <AuthMenu />
      { messages && <KratosMessages messages={ messages } /> }
      { form &&
        <KratosForm
          action={ form.action }
          fields={ form.fields }
          messages={ form.messages } /> }
    </React.Fragment>
  )
}

const Verify = () => {
  const [requestResponse, setRequestResponse] = useState<VerificationRequest>()

  useEffect(() => {
    const request = authHandler({ type: "verify" }) as Promise<VerificationRequest>
    request
      .then(request => setRequestResponse(request))
      .catch(() => {})
  }, [setRequestResponse])

  const { form, messages } = requestResponse || {}

  return (
    <React.Fragment>
      <AuthMenu />
      { messages && <KratosMessages messages={ messages } /> }
      { form &&
        <React.Fragment>
          <h4>Resend Verification Code</h4>
          <KratosForm
            action={ form.action }
            fields={ form.fields }
            messages={ form.messages } />
        </React.Fragment> }
    </React.Fragment>
  )
}

const Recover = () => {
  const [requestResponse, setRequestResponse] = useState<RecoveryRequest>()

  useEffect(() => {
    const request = authHandler({ type: "recover" }) as Promise<RecoveryRequest>
    request
      .then(request => setRequestResponse(request))
      .catch(() => {})
  }, [setRequestResponse])

  const form = requestResponse?.methods?.link?.config
  const messages = requestResponse?.messages

  return (
    <React.Fragment>
      <AuthMenu />
      { messages && <KratosMessages messages={ messages } /> }
      { form &&
        <React.Fragment>
          <KratosForm
            action={ form.action }
            fields={ form.fields }
            messages={ form.messages } />
      </React.Fragment> }
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
            <Route path="/auth/login" element={ <Login /> } />
            <Route path="/settings" element={ <Settings /> } />
            <Route path="/verify" element={ <Verify /> } />
            <Route path="/recovery" element={ <Recover /> } />
            <Route path="/auth/registration" element={ <Register /> } />
          </Routes>
        </BrowserRouter>
      </IdentityProvider>
    </div>
  )
}

export default App
