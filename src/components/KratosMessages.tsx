import React from "react"
import { Message } from "@oryd/kratos-client"

export const KratosMessages = ({ messages }: { messages: Message[] }) => (
  <div className="messages">
    { messages.map(({ text, id, type }) =>
        <div key={ id } className={ `message ${type}` }>{ text }</div>) }
  </div>
)
