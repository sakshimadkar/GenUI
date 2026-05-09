import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { RiUserLine, RiSunLine, RiMoonLine, RiMenuLine } from 'react-icons/ri'
import { BiLogOut } from 'react-icons/bi'

const Navbar = ({ sidebarWidth = '220px', isMobile, onHamburger }) => {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: sidebarWidth,
      right: 0,
      height: '60px',
      background: 'var(--glass)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      zIndex: 30,
      transition: 'left 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
    }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {isMobile && (
          <button
            onClick={onHamburger}
            style={{
              width: '36px', height: '36px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '18px', flexShrink: 0
            }}
          >
            <RiMenuLine />
          </button>
        )}

        {isMobile ? (
          <h2 className='sp-text' style={{ fontSize: '18px', fontWeight: 800 }}>GenUI</h2>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: 'var(--accent)',
              boxShadow: '0 0 10px var(--accent)',
              animation: 'pulse-glow 2s infinite'
            }} />
            <span style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap'
            }}>
              AI Component Studio
            </span>
          </div>
        )}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            width: '36px', height: '36px',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            background: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '16px',
            transition: 'all 0.2s ease', flexShrink: 0
          }}
        >
          {isDark ? <RiSunLine /> : <RiMoonLine />}
        </button>

        {user ? (
          <>
            {!isMobile && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 12px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '10px'
              }}>
                <RiUserLine style={{ color: 'var(--accent)', fontSize: '14px' }} />
                <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {user.username}
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 10px',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
                flexShrink: 0
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--danger)'
                e.currentTarget.style.color = 'var(--danger)'
                e.currentTarget.style.background = 'rgba(239,68,68,0.05)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-secondary)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <BiLogOut />
              {!isMobile && 'Logout'}
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className='btn-primary'
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  )
}

export default Navbar