import React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "services/auth"
import { isAuthenticated } from "services/auth"

export const AuthMenu = () => {
  const { login, register, logout } = useAuth()

  let menu
  if (isAuthenticated()) {
    menu = (
      <React.Fragment>
        <Link to="/settings">Settings</Link>
        <button onClick={ logout }>Logout</button>
      </React.Fragment>
    )
  } else {
    menu = (
      <React.Fragment>
        <button onClick={ login }>Login</button>
        <button onClick={ register }>Register</button>
      </React.Fragment>
    )
  }

  return (
    <div className="auth-menu">
      { menu }
    </div>
  )
}
