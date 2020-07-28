import React, { useEffect, useState } from "react"
import { RecoveryRequest } from "@oryd/kratos-client"
import { initialiseRequest } from "services/kratos"
import { AuthMenu } from "components/AuthMenu"
import { KratosMessages } from "components/KratosMessages"
import { KratosForm } from "components/KratosForm"

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
