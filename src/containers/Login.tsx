import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { LoginRequest } from "@oryd/kratos-client"
import { initialiseRequest } from "services/kratos"
import { IconLogo } from "components/IconLogo"
import { KratosMessages } from "components/KratosMessages"
import { KratosForm } from "components/KratosForm"
import { register } from "services/auth"
import config from "config/kratos"

export const Login = () => {
  const [requestResponse, setRequestResponse] = useState<LoginRequest>()

  useEffect(() => {
    const request = initialiseRequest({ type: "login" }) as Promise<LoginRequest>
    request
      .then(request => setRequestResponse(request))
      .catch(() => {})
  }, [setRequestResponse])

  const messages = requestResponse?.messages
  const form = requestResponse?.methods?.password?.config

  return (
    <div className="auth">
      <div className="container">
        <IconLogo />
        <h5 className="subheading">Welcome to this example login screen!</h5>
        <div id="login-password">
          { messages && <KratosMessages messages={ messages } /> }
          { form &&
            <KratosForm
              submitLabel="Sign in"
              action={ form.action }
              fields={ form.fields }
              messages={ form.messages } /> }
        </div>
        <hr className="divider" />
        <div className="alternative-actions">
          <p>
            <button onClick={ () => register({ setReferer: false }) } className="a">
              Register new account
            </button>
          </p>
          <p>
            <Link to={ config.routes.recovery.path }>Reset password</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
