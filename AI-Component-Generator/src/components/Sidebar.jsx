import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BsStars, BsClock, BsBookmark, BsPeople } from 'react-icons/bs'
import { HiOutlineHome, HiChevronLeft, HiChevronRight, HiX } from 'react-icons/hi'
import { RiUserLine } from 'react-icons/ri'

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen, isMobile }) => {
  const location = useLocation()

  const links = [
    { to: '/', icon: <HiOutlineHome />, label: 'Home' },
    { to: '/generate', icon: <BsStars />, label: 'Generate' },
    { to: '/history', icon: <BsClock />, label: 'History' },
    { to: '/favorites', icon: <BsBookmark />, label: 'Favorites' },
    { to: '/community', icon: <BsPeople />, label: 'Community' },
    { to: '/profile', icon: <RiUserLine />, label: 'Profile' },
  ]

  const isVisible = isMobile ? mobileOpen : true
  const width = isMobile ? '260px' : collapsed ? '64px' : '220px'

  return (
    <aside style={{
      width,
      height: '100vh',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      padding: (!isMobile && collapsed) ? '24px 8px' : '24px 12px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'fixed',
      top: 0,
      left: isMobile ? (mobileOpen ? '0' : '-260px') : '0',
      zIndex: 40,
      transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
      overflow: 'hidden'
    }}>

      {/* Top Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* Logo + Close button for mobile */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', padding: '8px 12px' }}>
          {(!collapsed || isMobile) && (
            <div>
              <h2 className='sp-text' style={{ fontSize: '22px', fontWeight: 800 }}>GenUI</h2>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '2px' }}>
                AI Component Studio
              </p>
            </div>
          )}
          {collapsed && !isMobile && (
            <h2 className='sp-text' style={{ fontSize: '18px', fontWeight: 800 }}>G</h2>
          )}
          {isMobile && (
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '18px'
              }}
            >
              <HiX />
            </button>
          )}
        </div>

        {/* Nav Links */}
        {links.map(link => {
          const isActive = location.pathname === link.to
          return (
            <Link
              key={link.to}
              to={link.to}
              title={collapsed && !isMobile ? link.label : ''}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: (collapsed && !isMobile) ? 'center' : 'flex-start',
                gap: '10px',
                padding: (collapsed && !isMobile) ? '12px' : '10px 12px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-glow)' : 'transparent',
                border: isActive ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--bg-hover)'
                  e.currentTarget.style.color = 'var(--text-primary)'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }
              }}
            >
              <span style={{ fontSize: '18px', flexShrink: 0 }}>{link.icon}</span>
              {(!collapsed || isMobile) && link.label}
            </Link>
          )
        })}
      </div>

      {/* Bottom — Collapse Button (desktop only) */}
      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '8px',
            padding: collapsed ? '12px' : '10px 12px',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            width: '100%'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--bg-hover)'
            e.currentTarget.style.color = 'var(--text-primary)'
            e.currentTarget.style.borderColor = 'var(--border-hover)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--text-muted)'
            e.currentTarget.style.borderColor = 'var(--border)'
          }}
        >
          <span style={{ fontSize: '16px', flexShrink: 0 }}>
            {collapsed ? <HiChevronRight /> : <HiChevronLeft />}
          </span>
          {!collapsed && 'Collapse'}
        </button>
      )}
    </aside>
  )
}

export default Sidebar