import React, { useEffect, useState } from "react"
import "./App.css"
import config from "./config"
import { PublicApi } from "@oryd/kratos-client"

const kratos = new PublicApi(config.kratos.public)

interface AuthHandlerOpts {
  type: "login" | "registration";

  setRequestResponse: any;
}


const retry = ({ type } : { type: String }) => {
  const location = `${config.kratos.browser}/self-service/browser/flows/${type}`
  window.location.href = location
}

const authHandler = ({type, setRequestResponse}: AuthHandlerOpts) => {
  const params = new URLSearchParams(window.location.search)
  const request = params.get("request") || ""

  if (!request) return retry({ type })

  const authRequest = type === "login"
    ? kratos.getSelfServiceBrowserLoginRequest(request)
    : kratos.getSelfServiceBrowserRegistrationRequest(request)

  authRequest.then(({body, response}) => {
    if (response.statusCode !== 200) if (!request) return retry({ type })
    setRequestResponse(body)
  }).catch(error => {
    console.log(error)
    retry({ type })
  })
}

const Register = () => {
  const [requestResponse, setRequestResponse] = useState({
    methods: {
      password: {
        config: {
          action: "",
          fields: [],
          messages: []
        }
      }
    }
  })

  useEffect(() => {
    authHandler({
      type: "registration",
      setRequestResponse
    })
  }, [])

  const {action, fields = [], messages = []} = requestResponse?.methods?.password?.config

  const labels = {
    "traits.email": "Email",
    password: "Passwords"
  }

  const fieldDisplay = fields.map(({name, type, required, value, messages = []}) => {
    const _required = required ? {required} : {}
    return (
      <React.Fragment key={name}>
        <p><label>{labels[name]}</label></p>
        <input type={type} name={name} defaultValue={value} {..._required} />
        <p>{messages.map(({text}) => text)}</p>
      </React.Fragment>
    )
  })

  return (
    <React.Fragment>
      {messages.map(({text}) => text)}
      {action &&
      <form action={action} style={{margin: "60px 0"}} method="POST">
        {fieldDisplay}
        <input type="submit" value="Register"/>
      </form>}
    </React.Fragment>
  )
}

const Login = () => {
  const [requestResponse, setRequestResponse] = useState({
    methods: {
      password: {
        config: {
          action: "",
          fields: [],
          messages: []
        }
      }
    }
  })

  useEffect(() => {
    authHandler({
      type: "login",
      setRequestResponse
    })
  }, [])

  const {action, fields = [], messages = []} = requestResponse?.methods?.password?.config

  const labels = {
    identifier: "Email",
    password: "Password"
  }

  const fieldDisplay = fields.map(({name, type, required, value}) => {
    const _required = required ? {required} : {}
    return (
      <React.Fragment key={name}>
        <label>{labels[name]}</label>
        <input type={type} name={name} defaultValue={value} {..._required} />
      </React.Fragment>
    )
  })

  return (
    <React.Fragment>
      <a href="/auth/registration">Register</a>
      <p>{messages.map(({text}) => text)}</p>
      {action &&
      <form action={action} style={{margin: "60px 0"}} method="POST">
        {fieldDisplay}
        <input type="submit" value="Login"/>
      </form>}
    </React.Fragment>
  )
}

const Profile = () => {
  const [profile, setProfile] = useState({
    identity: {
      traits: {}
    }
  })

  useEffect(() => {
    const endpoint = "/.ory/kratos/public/sessions/whoami"
    const headers = {"Accept": "application/json"}
    fetch(endpoint, {method: "GET", headers})
      .then(r => r.json())
      .then((body) => setProfile(body))
  }, [])

  const display = profile?.identity?.traits

  return (
    <pre style={{textAlign: "left"}}>
      {JSON.stringify(display, null, "\t")}
    </pre>
  )
}

function App() {
  const {pathname} = window.location
  console.log(pathname)
  return (
    <div className="App">
      {pathname === "/" && <Profile/>}
      {pathname === "/auth/login" && <Login/>}
      {pathname === "/auth/registration" && <Register/>}
    </div>
  )
}

export default App
