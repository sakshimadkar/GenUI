import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { RiUserLine, RiMailLine, RiEditLine, RiCheckLine, RiCloseLine } from 'react-icons/ri'
import { BsStars, BsClock, BsBookmark } from 'react-icons/bs'
import { BiLogOut } from 'react-icons/bi'
import { toast } from 'react-toastify'
import aiService from '../services/aiService'

const Profile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState(user?.username || '')
  const [statsData, setStatsData] = useState({ total: 0, favorites: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      const res = await aiService.getHistory()
      if (res.success) {
        const total = res.components.length
        const favorites = res.components.filter(c => c.isFavorite).length
        setStatsData({ total, favorites })
      }
    }
    fetchStats()
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleSave = () => {
    toast.success('Profile updated!')
    setEditing(false)
  }

  const stats = [
    { icon: <BsStars />, label: 'Components Generated', value: statsData.total },
    { icon: <BsClock />, label: 'In History', value: statsData.total },
    { icon: <BsBookmark />, label: 'Favorites', value: statsData.favorites },
  ]

  return (
    <div style={{ padding: '40px', maxWidth: '800px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>
          My <span className='sp-text'>Profile</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '14px' }}>
          Manage your account details
        </p>
      </div>

      {/* Avatar + Info */}
      <div className='card-3d' style={{ padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{
            width: '80px', height: '80px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', fontWeight: 800, color: 'white',
            boxShadow: '0 8px 24px rgba(59,130,246,0.3)',
            flexShrink: 0
          }}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              {editing ? (
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className='input-field'
                  style={{ maxWidth: '200px', padding: '8px 12px', fontSize: '16px' }}
                  autoFocus
                />
              ) : (
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {user?.username}
                </h2>
              )}
              {editing ? (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={handleSave}
                    style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: 'rgba(16,185,129,0.1)',
                      border: '1px solid rgba(16,185,129,0.3)',
                      color: 'var(--success)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <RiCheckLine />
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      color: 'var(--danger)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <RiCloseLine />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    width: '28px', height: '28px', borderRadius: '7px',
                    background: 'var(--accent-glow)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    color: 'var(--accent)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px'
                  }}
                >
                  <RiEditLine />
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RiMailLine style={{ color: 'var(--text-muted)', fontSize: '14px' }} />
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>
                {user?.email}
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 18px',
              background: 'rgba(239,68,68,0.05)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '10px',
              color: 'var(--danger)',
              fontSize: '13px', cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.05)'}
          >
            <BiLogOut />
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {stats.map((stat, i) => (
          <div key={i} className='card-3d' style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', color: 'var(--accent)', marginBottom: '8px' }}>{stat.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>{stat.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'JetBrains Mono, monospace' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Account Info */}
      <div className='card-3d' style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Account Details
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: 'Username', value: user?.username, icon: <RiUserLine /> },
            { label: 'Email', value: user?.email, icon: <RiMailLine /> },
            { label: 'Account Type', value: 'Free Plan', icon: <BsStars /> },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'var(--bg-secondary)',
              borderRadius: '10px',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '13px' }}>
                {item.icon}
                {item.label}
              </div>
              <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Profile
