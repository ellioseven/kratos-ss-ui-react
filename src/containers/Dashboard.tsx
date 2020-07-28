import React from "react"
import { useSession } from "services/session"
import { AuthMenu } from "components/AuthMenu"

export const Dashboard = () => {
  const session = useSession()
  const user = session.identity?.traits || {}

  return (
    <React.Fragment>
      <AuthMenu />
      <pre style={ { textAlign: "left" } }>
        { JSON.stringify(user, null, "\t") }
      </pre>
    </React.Fragment>
  )
}
