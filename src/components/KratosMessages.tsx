import React from "react"
import { Message } from "@oryd/kratos-client"

export const KratosMessages = ({ messages }: { messages: Message[] }) => (
  <React.Fragment>
    { messages.map(({ text, id }) =>
        <p key={ id }>{ text }</p>) }
  </React.Fragment>
)
