import React, { useState, useEffect } from 'react'
import "./App.css"
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import NoPage from './pages/NoPage'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'
import History from './pages/History'
import Favorites from './pages/Favorites'
import Community from './pages/Community'
import Landing from './pages/Landing'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import RequireAuth from './components/RequireAuth'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import SharePage from './pages/SharePage'

const publicRoutes = ['/login', '/register']

const Layout = ({ children }) => {
  const location = useLocation()
  const { user } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const isPublicOnly = publicRoutes.includes(location.pathname)

  if (isPublicOnly || !user) {
    return <>{children}</>
  }

  const sidebarWidth = isMobile ? '0px' : collapsed ? '64px' : '220px'

  return (
    <div style={{ display: 'flex' }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 35,
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      <Sidebar
        collapsed={isMobile ? false : collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        isMobile={isMobile}
      />

      <div style={{
        marginLeft: sidebarWidth,
        flex: 1,
        minHeight: '100vh',
        transition: 'margin-left 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
      }}>
        <Navbar
          sidebarWidth={sidebarWidth}
          isMobile={isMobile}
          onHamburger={() => setMobileOpen(true)}
        />
        <main style={{ paddingTop: '60px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/generate" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/history" element={<RequireAuth><History /></RequireAuth>} />
        <Route path="/favorites" element={<RequireAuth><Favorites /></RequireAuth>} />
        <Route path="/community" element={<Community />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="*" element={<NoPage />} />
        <Route path="/share/:shareId" element={<SharePage />} />
      </Routes>
    </Layout>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastContainer position="top-right" theme="dark" />
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App