import React, { useEffect, useState } from "react"
import { LoginRequest } from "@oryd/kratos-client"
import { initialiseRequest } from "services/kratos"
import { IconLogo } from "components/IconLogo"
import { KratosMessages } from "components/KratosMessages"
import { KratosForm } from "components/KratosForm"
import { useAuth } from "services/auth"

export const Login = () => {
  const { register } = useAuth()
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
            action={ form.action }
            fields={ form.fields }
            messages={ form.messages } /> }
        </div>
        <hr className="divider" />
        <div className="alternative-actions">
          <p><a onClick={ register } href="#">Register new account</a></p>
          <p><a href="/recovery">Reset password</a></p>
        </div>
      </div>
    </div>
  )
}
