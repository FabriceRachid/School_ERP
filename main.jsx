import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles/main.css'

// Pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Teachers from './pages/Teachers'
import Classes from './pages/Classes'
import Grades from './pages/Grades'
import Payments from './pages/Payments'
import Reports from './pages/Reports'

// Composants
import ProtectedRoute from './components/ProtectedRoute'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Route publique */}
        <Route path="/login" element={<Login />} />
        
        {/* Routes protégées */}
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/students" element={
          <ProtectedRoute>
            <Students />
          </ProtectedRoute>
        } />

        <Route path="/teachers" element={
          <ProtectedRoute>
            <Teachers />
          </ProtectedRoute>
        } />

        <Route path="/classes" element={
          <ProtectedRoute>
            <Classes />
          </ProtectedRoute>
        } />

        <Route path="/grades" element={
          <ProtectedRoute>
            <Grades />
          </ProtectedRoute>
        } />

        <Route path="/payments" element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        } />

        <Route path="/reports" element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        } />

        {/* Redirection par défaut si la page n'existe pas */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
