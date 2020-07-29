import React, { useEffect, useState } from "react"
import { RecoveryRequest } from "@oryd/kratos-client"
import { initialiseRequest } from "services/kratos"
import { KratosMessages } from "components/KratosMessages"
import { KratosForm } from "components/KratosForm"
import { Header } from "components/Header"

export const Recover = () => {
  const [requestResponse, setRequestResponse] = useState<RecoveryRequest>()

  useEffect(() => {
    const request = initialiseRequest({ type: "recover" }) as Promise<RecoveryRequest>
    request
      .then(request => setRequestResponse(request))
      .catch(() => {})
  }, [setRequestResponse])

  const form = requestResponse?.methods?.link?.config
  const messages = requestResponse?.messages

  return (
    <div className="content">
      <Header />
      <div className="container">
        <h4>Recover Your Account</h4>
        { messages && <KratosMessages messages={ messages } /> }
        { form &&
          <KratosForm
            action={ form.action }
            fields={ form.fields }
            messages={ form.messages } /> }
      </div>
    </div>
  )
}
