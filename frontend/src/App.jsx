import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Auth/Register';
import Login from './Auth/Login';
import { AuthProvider } from './AuthProvider';
import Dashboard from './components/Dashboard';
import Home from './components/Home';

function App() {

  return (
    <>
    <Router>
      <AuthProvider> {/* Make sure AuthProvider wraps your routes */}
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          
        </Routes>
      </AuthProvider>
    </Router>
    </>
  )
}

export default App
