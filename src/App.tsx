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
import "./App.css"

function App() {
  return (
    <div className="App">
      <SessionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={ <Dashboard /> } />
            <Route path="/callback" element={ <Callback /> } />
            <Route path="/auth/login" element={ <Login /> } />
            <Route path="/settings" element={ <Settings /> } />
            <Route path="/verify" element={ <Verify /> } />
            <Route path="/recovery" element={ <Recover /> } />
            <Route path="/auth/registration" element={ <Register /> } />
          </Routes>
        </BrowserRouter>
      </SessionProvider>
    </div>
  )
}

export default App
