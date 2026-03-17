import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import aiService from '../services/aiService'
import Editor from '@monaco-editor/react'
import { BsStars } from 'react-icons/bs'
import { IoCopy } from 'react-icons/io5'
import { PiExportBold } from 'react-icons/pi'
import { useAuth } from '../contexts/AuthContext'

const SharePage = () => {
  const { shareId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [component, setComponent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(2)
  const [forking, setForking] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const res = await aiService.getSharedComponent(shareId)
      if (res.success) setComponent(res.component)
      else toast.error('Component not found!')
      setLoading(false)
    }
    fetch()
  }, [shareId])

  const handleFork = async () => {
    if (!user) {
      toast.error('Please login to remix this component!')
      navigate('/login')
      return
    }
    setForking(true)
    const res = await aiService.forkComponent(component._id)
    if (res.success) {
      toast.success('🍴 Remixed to your history!')
      navigate('/history')
    }
    setForking(false)
  }

  const copyCode = async () => {
    await navigator.clipboard.writeText(component.code)
    toast.success('Code copied!')
  }

  const downloadFile = () => {
    const blob = new Blob([component.code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'GenUI-Component.html'
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Downloaded!')
  }

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px', animation: 'pulse-glow 2s infinite' }}>⚡</div>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>Loading component...</p>
      </div>
    </div>
  )

  if (!component) return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '16px'
    }}>
      <div style={{ fontSize: '48px' }}>😕</div>
      <h2 style={{ color: 'var(--text-primary)', fontWeight: 800 }}>Component not found!</h2>
      <button
        onClick={() => navigate('/')}
        className='btn-primary'
        style={{ padding: '10px 24px' }}
      >
        Go Home
      </button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Ambient blobs */}
      <div style={{
        position: 'fixed', top: '10%', left: '20%',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px', flexWrap: 'wrap', gap: '12px'
        }}>
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <h1 className='sp-text' style={{ fontSize: '24px', fontWeight: 800 }}>GenUI</h1>
            <span style={{
              fontSize: '11px', color: 'var(--text-muted)',
              fontFamily: 'JetBrains Mono, monospace',
              padding: '2px 8px', borderRadius: '100px',
              border: '1px solid var(--border)'
            }}>
              shared component
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={copyCode}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'var(--bg-card)',
                color: 'var(--text-secondary)',
                fontSize: '13px', cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              <IoCopy /> Copy Code
            </button>
            <button
              onClick={downloadFile}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'var(--bg-card)',
                color: 'var(--text-secondary)',
                fontSize: '13px', cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              <PiExportBold /> Download
            </button>
            <button
              onClick={handleFork}
              disabled={forking}
              className='btn-primary'
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', fontSize: '13px', borderRadius: '10px',
                opacity: forking ? 0.7 : 1
              }}
            >
              <BsStars />
              {forking ? 'Remixing...' : 'Remix This'}
            </button>
          </div>
        </div>

        {/* Component Info */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '20px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '12px'
        }}>
          <div>
            <h2 style={{
              fontSize: '16px', fontWeight: 700,
              color: 'var(--text-primary)', marginBottom: '6px'
            }}>
              {component.prompt}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '11px', padding: '2px 10px',
                borderRadius: '100px',
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.2)',
                color: '#818cf8',
                fontFamily: 'JetBrains Mono, monospace'
              }}>
                {component.framework}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                by <strong style={{ color: 'var(--text-secondary)' }}>
                  {component.user?.username || 'Anonymous'}
                </strong>
              </span>
              {component.forkCount > 0 && (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  🍴 {component.forkCount} remixes
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {['Preview', 'Code'].map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i === 0 ? 2 : 1)}
                style={{
                  padding: '6px 16px', borderRadius: '8px', fontSize: '13px',
                  fontWeight: 600, cursor: 'pointer', border: 'none',
                  background: (i === 0 ? tab === 2 : tab === 1) ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: (i === 0 ? tab === 2 : tab === 1) ? 'white' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease', fontFamily: 'inherit'
                }}
              >{t}</button>
            ))}
          </div>
        </div>

        {/* Preview / Code */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          overflow: 'hidden',
          height: '70vh'
        }}>
          {tab === 2 ? (
            <iframe
              srcDoc={component.code}
              style={{ width: '100%', height: '100%', border: 'none', background: 'white' }}
            />
          ) : (
            <Editor
              value={component.code}
              height="100%"
              theme='vs-dark'
              language="html"
              options={{ fontSize: 13, minimap: { enabled: false }, padding: { top: 12 }, readOnly: true }}
            />
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Made with{' '}
            <span
              onClick={() => navigate('/')}
              style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
            >
              GenUI
            </span>
            {' '}— AI Component Studio
          </p>
        </div>
      </div>
    </div>
  )
}

export default SharePage