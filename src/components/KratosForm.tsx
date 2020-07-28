import React from "react"
import { FormField, Message } from "@oryd/kratos-client"
import { FORM_LABELS } from "constants/kratos"

export const KratosForm = ({ action, messages = [], fields }: { action: string, messages?: Message[], fields: FormField[] }) => {
  const fieldsSorted = sortFormFields({ fields })
  return (
    <React.Fragment>
      { messages.map(({ text }) => <p key={ text }>{ text }</p>) }
      { action &&
      <form action={ action } style={ { margin: "60px 0" } } method="POST">
        { renderFormFields({ fields: fieldsSorted })}
        <input type="submit" value="Submit"/>
      </form> }
    </React.Fragment>
  )
}

const sortFormFields = ({ fields }: { fields: FormField[]}) => {
  return fields.sort((current, next) => {
    const c = FORM_LABELS[current.name]?.priority || 0
    const n = FORM_LABELS[next.name]?.priority || 0
    return n - c
  })
}

const renderFormFields = ({ fields = [] }: { fields: FormField[] }) => fields.map(field => {
  const { name, type, required, value, messages = [] } = field
  const _required = required ? { required } : {}
  const _label = FORM_LABELS[name]?.label
  return (
    <React.Fragment key={ name }>
      { _label && <p><label>{ _label }</label></p> }
      <input
        type={ type }
        name={ name }
        defaultValue={ value as any }
        { ..._required } />
      <p>{ messages.map(({ text }) => text) }</p>
    </React.Fragment>
  )
})
