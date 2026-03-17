import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Select from 'react-select'
import { BsStars } from 'react-icons/bs'
import { HiOutlineCode } from 'react-icons/hi'
import Editor from '@monaco-editor/react'
import { IoCloseSharp, IoCopy } from 'react-icons/io5'
import { PiExportBold } from 'react-icons/pi'
import { ImNewTab } from 'react-icons/im'
import { FiRefreshCcw } from 'react-icons/fi'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { useTheme } from '../contexts/ThemeContext'
import aiService from '../services/aiService'

const Home = () => {
  const { isDark } = useTheme()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'html-tailwind-bootstrap', label: 'HTML + Tailwind + Bootstrap' },
  ]

  const [outputScreen, setOutputScreen] = useState(false)
  const [tab, setTab] = useState(1)
  const [prompt, setPrompt] = useState("")
  const [frameWork, setFrameWork] = useState(options[0])
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [isNewTabOpen, setIsNewTabOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [componentId, setComponentId] = useState(null)

  async function getResponse() {
    if (!prompt.trim()) return toast.error("Please describe your component first")
    try {
      setLoading(true)
      const res = await aiService.generateComponent(prompt, frameWork.value)
      if (res.success) {
        setCode(res.component.code)
        setComponentId(res.component._id)
        setIsFavorite(res.component.isFavorite || false)
        setIsPublic(res.component.isPublic || false)
        setOutputScreen(true)
        toast.success("Component generated!")
      } else {
        toast.error(res.message || "Something went wrong")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const copyCode = async () => {
    if (!code.trim()) return toast.error("No code to copy")
    try {
      await navigator.clipboard.writeText(code)
      toast.success("Code copied!")
    } catch {
      toast.error("Failed to copy")
    }
  }

  const downloadFile = () => {
    if (!code.trim()) return toast.error("No code to download")
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = "GenUI-Code.html"
    link.click()
    URL.revokeObjectURL(url)
    toast.success("File downloaded!")
  }

  const handleFavorite = async () => {
    if (!componentId) return toast.error("Generate a component first")
    const res = await aiService.toggleFavorite(componentId)
    if (res.success) {
      setIsFavorite(res.isFavorite)
      toast.success(res.isFavorite ? "Added to favorites! ⭐" : "Removed from favorites")
    } else {
      toast.error("Something went wrong")
    }
  }

  const handleShare = async () => {
    if (!componentId) return toast.error("Generate a component first")
    const res = await aiService.shareComponent(componentId)
    if (res.success) {
      const shareUrl = `${window.location.origin}/share/${res.shareId}`
      await navigator.clipboard.writeText(shareUrl)
      toast.success("Share link copied! 🔗")
    } else {
      toast.error("Something went wrong")
    }
  }

  const handleCommunity = async () => {
    if (!componentId) return toast.error("Generate a component first")
    const res = await aiService.togglePublic(componentId)
    if (res.success) {
      setIsPublic(res.isPublic)
      toast.success(res.isPublic ? "Added to community! 🌍" : "Removed from community")
    } else {
      toast.error("Something went wrong")
    }
  }

  const selectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: 'var(--bg-card)',
      borderColor: 'var(--border)',
      color: 'var(--text-primary)',
      boxShadow: 'none',
      "&:hover": { borderColor: 'var(--accent)' }
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? 'var(--accent)' : state.isFocused ? 'var(--bg-hover)' : 'transparent',
      color: state.isSelected ? 'white' : 'var(--text-primary)',
      "&:active": { backgroundColor: 'var(--accent)' }
    }),
    singleValue: (base) => ({ ...base, color: 'var(--text-primary)' }),
    placeholder: (base) => ({ ...base, color: 'var(--text-muted)' }),
    input: (base) => ({ ...base, color: 'var(--text-primary)' }),
    dropdownIndicator: (base) => ({ ...base, color: 'var(--text-muted)' }),
    indicatorSeparator: (base) => ({ ...base, backgroundColor: 'var(--border)' }),
  }

  const iconBtnStyle = {
    width: '32px', height: '32px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--bg-card)',
    color: 'var(--text-muted)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.2s'
  }

  return (
    <>
      <Navbar />

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '20px',
        padding: isMobile ? '16px' : '24px 40px',
        marginTop: isMobile ? '8px' : '0'
      }}>

        {/* LEFT SECTION */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: isMobile ? '16px' : '24px',
          marginTop: '20px'
        }}>
          <h3 className='sp-text' style={{
            fontSize: isMobile ? '18px' : '22px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '6px'
          }}>
            AI Component Generator
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
            Describe your component and let AI code it for you.
          </p>

          {/* Framework */}
          <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Framework
          </p>
          <Select
            options={options}
            value={frameWork}
            styles={selectStyles}
            onChange={(selected) => setFrameWork(selected)}
          />

          {/* Prompt */}
          <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', margin: '20px 0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Describe your component
          </p>
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
            style={{
              width: '100%',
              minHeight: '180px',
              borderRadius: '12px',
              background: 'var(--bg-main)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              padding: '14px',
              fontSize: '13px',
              lineHeight: '1.8',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s'
            }}
            placeholder={`Try these examples:\n\n🎨  A glassmorphism login form with email, password, Google & GitHub buttons\n\n🧭  A modern navbar with logo, links, dark mode toggle and CTA button\n\n💳  Three pricing cards — Free $0, Pro $29, Enterprise $99 with features\n\n📊  An analytics dashboard with stats cards, bar chart and transactions table\n\n👤  A developer profile card with avatar, skills badges and social links\n\n🚀  A hero section with gradient headline, subtitle and CTA buttons`}
          />

          {/* Generate Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '16px',
            marginBottom: '12px',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              Click generate to get your code
            </p>
            <button
              onClick={getResponse}
              disabled={loading}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 24px',
                background: 'linear-gradient(135deg, var(--accent), #3b82f6)',
                border: 'none', borderRadius: '10px',
                color: 'white', fontSize: '14px', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                fontFamily: 'inherit',
                boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
                transition: 'all 0.2s',
                width: isMobile ? '100%' : 'auto',
                justifyContent: 'center'
              }}
            >
              {loading ? <ClipLoader color='white' size={16} /> : <BsStars />}
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>

            {/* Favorite */}
            <button
              onClick={handleFavorite}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.color = '#f59e0b' }}
              onMouseLeave={e => {
                if (!isFavorite) {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--text-muted)'
                }
              }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                padding: '10px 6px',
                background: isFavorite ? 'rgba(245,158,11,0.1)' : 'var(--bg-card)',
                border: `1px solid ${isFavorite ? 'rgba(245,158,11,0.5)' : 'var(--border)'}`,
                borderRadius: '10px',
                color: isFavorite ? '#f59e0b' : 'var(--text-muted)',
                fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.2s'
              }}
            >
              {isFavorite ? '★' : '☆'}
              <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                padding: '10px 6px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                color: 'var(--text-muted)',
                fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.2s'
              }}
            >
              🔗 <span>Share</span>
            </button>

            {/* Community */}
            <button
              onClick={handleCommunity}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#22c55e'; e.currentTarget.style.color = '#22c55e' }}
              onMouseLeave={e => {
                if (!isPublic) {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--text-muted)'
                }
              }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                padding: '10px 6px',
                background: isPublic ? 'rgba(34,197,94,0.1)' : 'var(--bg-card)',
                border: `1px solid ${isPublic ? 'rgba(34,197,94,0.5)' : 'var(--border)'}`,
                borderRadius: '10px',
                color: isPublic ? '#22c55e' : 'var(--text-muted)',
                fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.2s'
              }}
            >
              {isPublic ? '🌍' : '🌐'}
              <span>{isPublic ? 'Public' : 'Community'}</span>
            </button>

          </div>
        </div>

        {/* RIGHT SECTION */}
        <div style={{
          marginTop: '20px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          overflow: 'hidden',
          height: isMobile ? '70vh' : '85vh'
        }}>
          {!outputScreen ? (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '12px'
            }}>
              <div style={{
                width: '64px', height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), #3b82f6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', color: 'white',
                boxShadow: '0 8px 30px rgba(124,58,237,0.3)'
              }}>
                <HiOutlineCode />
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>
                Your component & code will appear here.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                Describe a component and click Generate
              </p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div style={{
                background: 'var(--bg-main)',
                borderBottom: '1px solid var(--border)',
                padding: '8px 12px',
                display: 'flex', gap: '8px'
              }}>
                {['Code', 'Preview'].map((t, i) => (
                  <button
                    key={t}
                    onClick={() => setTab(i + 1)}
                    style={{
                      flex: 1, padding: '8px',
                      borderRadius: '8px', border: 'none',
                      background: tab === i + 1 ? 'var(--accent)' : 'var(--bg-card)',
                      color: tab === i + 1 ? 'white' : 'var(--text-muted)',
                      fontSize: '13px', fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.2s'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Toolbar */}
              <div style={{
                background: 'var(--bg-main)',
                borderBottom: '1px solid var(--border)',
                padding: '0 16px', height: '44px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {tab === 1 ? '📄 Code Editor' : '👁️ Live Preview'}
                </p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {tab === 1 ? (
                    <>
                      <button onClick={copyCode} title="Copy" style={iconBtnStyle}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}>
                        <IoCopy size={14} />
                      </button>
                      <button onClick={downloadFile} title="Download" style={iconBtnStyle}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}>
                        <PiExportBold size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setIsNewTabOpen(true)} title="Fullscreen" style={iconBtnStyle}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}>
                        <ImNewTab size={13} />
                      </button>
                      <button onClick={() => setRefreshKey(p => p + 1)} title="Refresh" style={iconBtnStyle}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}>
                        <FiRefreshCcw size={13} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Editor / Preview */}
              <div style={{ height: 'calc(100% - 100px)' }}>
                {tab === 1 ? (
                  <Editor
                    value={code}
                    height="100%"
                    theme={isDark ? 'vs-dark' : 'light'}
                    language="html"
                    options={{
                      fontSize: 13,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      wordWrap: 'on',
                      padding: { top: 12 }
                    }}
                  />
                ) : (
                  <iframe
                    key={refreshKey}
                    srcDoc={code}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="Component Preview"
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Fullscreen Preview */}
      {isNewTabOpen && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'white', zIndex: 50,
          display: 'flex', flexDirection: 'column'
        }}>
          <div style={{
            height: '52px',
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 16px'
          }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              🖥️ Fullscreen Preview
            </p>
            <button onClick={() => setIsNewTabOpen(false)} style={iconBtnStyle}>
              <IoCloseSharp size={16} />
            </button>
          </div>
          <iframe
            srcDoc={code}
            style={{ flex: 1, border: 'none' }}
            title="Fullscreen Preview"
          />
        </div>
      )}
    </>
  )
}

export default Home