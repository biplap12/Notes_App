import React from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/SignUp'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const routes=(
  <Router>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signUp" element={<Signup/>} />
    </Routes>
  </Router>
)

const App = () => {
  return (
    <>
      {routes}    
    </>

  )
}

export default App