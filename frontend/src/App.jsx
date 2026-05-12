import { BrowserRouter, Routes, Route } from "react-router-dom"
import React from 'react'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App