import React, { useEffect, useState } from "react"
import { RegistrationRequest } from "@oryd/kratos-client"
import { initialiseRequest } from "services/kratos"
import { AuthMenu } from "components/AuthMenu"
import { KratosMessages } from "components/KratosMessages"
import { KratosForm } from "components/KratosForm"

export const Register = () => {
  const [requestResponse, setRequestResponse] = useState<RegistrationRequest>()

  useEffect(() => {
    const request = initialiseRequest({ type: "register" }) as Promise<RegistrationRequest>
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
