import React, { useEffect, useState } from "react"
import { SettingsRequest } from "@oryd/kratos-client"
import { initialiseRequest } from "services/kratos"
import { AuthMenu } from "components/AuthMenu"
import { KratosMessages } from "components/KratosMessages"
import { KratosForm } from "components/KratosForm"

export const Settings = () => {
  const [requestResponse, setRequestResponse] = useState<SettingsRequest>()

  useEffect(() => {
    const request = initialiseRequest({ type: "settings" }) as Promise<SettingsRequest>
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
