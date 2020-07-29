import React from "react"
import { FormField, Message } from "@oryd/kratos-client"
import { FORM_LABELS } from "constants/kratos"
import { KratosMessages } from "components/KratosMessages"

export const KratosForm = ({ action, messages = [], fields, submitLabel = "Submit" }: { action: string, messages?: Message[], fields: FormField[], submitLabel: string }) => {
  const fieldsSorted = sortFormFields({ fields })
  return (
    <React.Fragment>
      { !!messages?.length && <KratosMessages messages={ messages } /> }
      { action &&
        <form action={ action } style={ { margin: "60px 0" } } method="POST">
          { renderFormFields({ fields: fieldsSorted })}
          <button type="submit">{ submitLabel }</button>
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
  const style = type === "hidden" ? { display: "none" } : {}
  return (
    <fieldset key={ name } style={ style }>
      <label>
        <input
          type={ type }
          name={ name }
          defaultValue={ value as any }
          { ..._required } />
        { _label && <span>{ _label }</span> }
      </label>
      <KratosMessages messages={ messages } />
    </fieldset>
  )
})
