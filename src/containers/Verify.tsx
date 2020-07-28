import React, { useEffect, useState } from "react"
import { VerificationRequest } from "@oryd/kratos-client"
import { initialiseRequest } from "services/kratos"
import { AuthMenu } from "components/AuthMenu"
import { KratosMessages } from "components/KratosMessages"
import { KratosForm } from "components/KratosForm"

export const Verify = () => {
  const [requestResponse, setRequestResponse] = useState<VerificationRequest>()

  useEffect(() => {
    const request = initialiseRequest({ type: "verify" }) as Promise<VerificationRequest>
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
