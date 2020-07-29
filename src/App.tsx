import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Login } from "containers/Login"
import { Register } from "containers/Register"
import { Recover } from "containers/Recover"
import { Callback } from "containers/Callback"
import { Dashboard } from "containers/Dashboard"
import { SessionProvider } from "services/session"
import { Settings } from "containers/Settings"
import { Verify } from "containers/Verify"
import config from "config/kratos"
import "./App.css"

function App() {
  return (
    <div className="App">
      <SessionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={ <Dashboard /> } />
            <Route path="/callback" element={ <Callback /> } />
            <Route path={ config.routes.login.path } element={ <Login /> } />
            <Route path={ config.routes.settings.path } element={ <Settings /> } />
            <Route path={ config.routes.verification.path } element={ <Verify /> } />
            <Route path={ config.routes.recovery.path } element={ <Recover /> } />
            <Route path={ config.routes.registration.path } element={ <Register /> } />
          </Routes>
        </BrowserRouter>
      </SessionProvider>
    </div>
  )
}

export default App
