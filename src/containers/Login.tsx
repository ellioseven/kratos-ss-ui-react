import React, { useEffect, useState } from "react"
import { LoginRequest } from "@oryd/kratos-client"
import { initialiseRequest } from "services/kratos"
import { AuthMenu } from "components/AuthMenu"
import { KratosMessages } from "components/KratosMessages"
import { KratosForm } from "components/KratosForm"

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
