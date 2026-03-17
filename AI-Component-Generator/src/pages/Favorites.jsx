import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import aiService from '../services/aiService'
import Editor from '@monaco-editor/react'

const Favorites = () => {
  const [components, setComponents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState(1)
  const [showPreview, setShowPreview] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    fetchFavorites()
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchFavorites = async () => {
    const res = await aiService.getHistory()
    if (res.success) setComponents(res.components.filter(c => c.isFavorite))
    setLoading(false)
  }

  const handleUnfavorite = async (id) => {
    const res = await aiService.toggleFavorite(id)
    if (res.success) {
      setComponents(prev => prev.filter(c => c._id !== id))
      if (selected?._id === id) { setSelected(null); setShowPreview(false) }
      toast.success('Removed from favorites')
    }
  }

  const handleShare = async (id) => {
    const res = await aiService.shareComponent(id)
    if (res.success) {
      const shareUrl = `${window.location.origin}/share/${res.shareId}`
      await navigator.clipboard.writeText(shareUrl)
      toast.success('🔗 Share link copied!')
    }
  }

  return (
    <div style={{ padding: '24px', height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
            My <span className='sp-text'>Favorites</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Your bookmarked components
          </p>
        </div>
        {isMobile && showPreview && (
          <button
            onClick={() => setShowPreview(false)}
            style={{
              padding: '8px 14px', borderRadius: '10px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '13px', cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            ← Back
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
        </div>
      ) : components.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <div style={{ fontSize: '48px' }}>⭐</div>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>No favorites yet!</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Star any component from History to save it here.</p>
        </div>
      ) : (
        <div className='favorites-grid' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flex: 1, minHeight: 0 }}>

          {/* Left - Component List */}
          <div style={{
            display: isMobile && showPreview ? 'none' : 'flex',
            flexDirection: 'column', gap: '10px',
            overflowY: 'auto', paddingRight: '4px'
          }}>
            {components.map(c => (
              <div
                key={c._id}
                onClick={() => { setSelected(c); if (isMobile) setShowPreview(true) }}
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: selected?._id === c._id ? 'var(--accent-glow)' : 'var(--bg-card)',
                  border: `1px solid ${selected?._id === c._id ? 'rgba(59,130,246,0.3)' : 'var(--border)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <p style={{
                  fontSize: '14px', fontWeight: 600,
                  color: 'var(--text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '100%',
                  marginBottom: '6px'
                }}>
                  {c.prompt}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '11px', padding: '2px 8px',
                    borderRadius: '100px',
                    background: 'rgba(245,158,11,0.1)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    color: '#f59e0b',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                    {c.framework}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button
                    onClick={e => { e.stopPropagation(); handleUnfavorite(c._id) }}
                    style={{
                      padding: '4px 10px', borderRadius: '7px', fontSize: '12px',
                      border: '1px solid #f59e0b',
                      background: 'rgba(245,158,11,0.08)',
                      color: '#f59e0b',
                      cursor: 'pointer', fontFamily: 'inherit'
                    }}
                  >
                    ★ Unfavorite
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); handleShare(c._id) }}
                    style={{
                      padding: '4px 10px', borderRadius: '7px', fontSize: '12px',
                      border: '1px solid var(--border)',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer', fontFamily: 'inherit'
                    }}
                  >
                    🔗 Share
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right - Preview */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            overflow: 'hidden',
            display: isMobile && !showPreview ? 'none' : 'flex',
            flexDirection: 'column',
            gridColumn: isMobile && showPreview ? '1 / -1' : 'auto'
          }}>
            {!selected ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Select a component to preview</p>
              </div>
            ) : (
              <>
                <div style={{
                  background: 'var(--bg-secondary)',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex', padding: '8px 12px', gap: '6px'
                }}>
                  {['Code', 'Preview'].map((t, i) => (
                    <button
                      key={t}
                      onClick={() => setTab(i + 1)}
                      style={{
                        padding: '6px 16px', borderRadius: '8px', fontSize: '13px',
                        fontWeight: 600, cursor: 'pointer', border: 'none',
                        background: tab === i + 1 ? 'var(--accent)' : 'transparent',
                        color: tab === i + 1 ? 'white' : 'var(--text-secondary)',
                        transition: 'all 0.2s ease', fontFamily: 'inherit'
                      }}
                    >{t}</button>
                  ))}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  {tab === 1 ? (
                    <Editor
                      value={selected.code}
                      height="100%"
                      theme='vs-dark'
                      language="html"
                      options={{ fontSize: 13, minimap: { enabled: false }, padding: { top: 12 }, readOnly: true }}
                    />
                  ) : (
                    <iframe
                      srcDoc={selected.code}
                      style={{ width: '100%', height: '100%', border: 'none', background: 'white' }}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Favorites