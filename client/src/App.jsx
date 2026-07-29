import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material'
import Login from './components/login'
import Register from './components/register'
import Dashboard from './components/dashboard'
import Home from './components/home'
import { isAuthenticated } from './utils/token'
import './App.css'

// Protected Route wrapper
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Public Layout (only for login and register)
function PublicLayout({ children }) {
  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#1a1a2e' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            My App
          </Typography>
          <Button
            color="inherit"
            component={Link}
            to="/login"
            sx={{
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Login
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/register"
            sx={{
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Register
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {children}
      </Container>
    </>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Home - Public */}
        <Route path="/" element={<Home />} />

        {/* Dashboard - Protected */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Login - Public */}
        <Route path="/login" element={
          <PublicLayout>
            <Login />
          </PublicLayout>
        } />

        {/* Register - Public */}
        <Route path="/register" element={
          <PublicLayout>
            <Register />
          </PublicLayout>
        } />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App