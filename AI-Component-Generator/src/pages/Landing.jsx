import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BsStars } from 'react-icons/bs'
import { HiOutlineCode } from 'react-icons/hi'
import { useAuth } from '../contexts/AuthContext'
import aiService from '../services/aiService'

const features = [
  { icon: '⚡', title: 'Instant Generation', desc: 'Generate production-ready UI components in seconds using AI' },
  { icon: '🎨', title: 'Multiple Frameworks', desc: 'HTML, Tailwind, Bootstrap — choose your preferred stack' },
  { icon: '📁', title: 'Save & Organize', desc: 'History, favorites, and personal library at your fingertips' },
  { icon: '🌍', title: 'Community Gallery', desc: 'Explore, fork and remix components shared by developers' },
  { icon: '🔗', title: 'Instant Sharing', desc: 'Share any component with a unique link in one click' },
  { icon: '🍴', title: 'Remix & Fork', desc: 'Take any community component and make it your own' },
]

const Landing = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const heroRef = useRef(null)
  const [stats, setStats] = useState({ totalUsers: 0, totalComponents: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      const res = await aiService.getStats()
      if (res.success) setStats(res.stats)
    }
    fetchStats()
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      const x = (clientX / innerWidth - 0.5) * 20
      const y = (clientY / innerHeight - 0.5) * 20
      heroRef.current.style.transform = `perspective(1000px) rotateX(${-y * 0.3}deg) rotateY(${x * 0.3}deg)`
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Ambient blobs */}
      <div style={{
        position: 'fixed', top: '10%', left: '20%',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0
      }} />
      <div style={{
        position: 'fixed', bottom: '20%', right: '15%',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <div style={{
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '0 24px', textAlign: 'center'
        }}>
          {/* Badge */}
          <div className='animate-fadeInUp' style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px',
            background: 'rgba(59,130,246,0.08)',
            border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: '100px',
            marginBottom: '32px',
            fontSize: '13px',
            color: 'var(--accent)',
            fontFamily: 'JetBrains Mono, monospace'
          }}>
            <span style={{
              display: 'inline-block', width: '6px', height: '6px',
              borderRadius: '50%', background: 'var(--accent)',
              animation: 'pulse-glow 2s infinite'
            }} />
            AI-Powered Component Studio
          </div>

          {/* Heading */}
          <div ref={heroRef} style={{ transition: 'transform 0.1s ease' }}>
            <h1 className='animate-fadeInUp delay-1' style={{
              fontSize: 'clamp(40px, 7vw, 80px)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              marginBottom: '24px',
              color: 'var(--text-primary)'
            }}>
              Build{' '}
              <span className='sp-text'>Stunning UI</span>
              <br />
              Components with AI
            </h1>
          </div>

          <p className='animate-fadeInUp delay-2' style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            maxWidth: '520px',
            lineHeight: 1.7,
            marginBottom: '40px'
          }}>
            Describe any component and get production-ready, responsive code instantly. Save, share, and remix with the community.
          </p>

          {/* CTA Buttons */}
          <div className='animate-fadeInUp delay-3' style={{
            display: 'flex', gap: '12px',
            flexWrap: 'wrap', justifyContent: 'center'
          }}>
            <button
              onClick={() => navigate(user ? '/generate' : '/register')}
              className='btn-primary'
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '14px 28px', fontSize: '15px', borderRadius: '12px'
              }}
            >
              <BsStars />
              {user ? 'Start Generating' : 'Get Started Free'}
            </button>
            <button
              onClick={() => navigate('/community')}
              className='btn-secondary'
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '14px 28px', fontSize: '15px', borderRadius: '12px'
              }}
            >
              <HiOutlineCode />
              Explore Community
            </button>
          </div>

          {/* Real Stats */}
          <div className='animate-fadeInUp delay-4' style={{
            display: 'flex', gap: '40px', marginTop: '60px',
            flexWrap: 'wrap', justifyContent: 'center'
          }}>
            {[
              { label: 'Components Generated', value: stats.totalComponents + '+' },
              { label: 'Frameworks Supported', value: '5+' },
              { label: 'Community Members', value: stats.totalUsers + '+' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent)' }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '12px', color: 'var(--text-muted)',
                  marginTop: '4px', fontFamily: 'JetBrains Mono, monospace'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Everything you need to <span className='sp-text'>build faster</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '12px', fontSize: '16px' }}>
              A complete AI-powered workflow for UI development
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {features.map((f, i) => (
              <div key={i} className='card-3d' style={{ padding: '28px', cursor: 'default' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'var(--accent-glow)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px', marginBottom: '16px'
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Bottom */}
        <div style={{
          textAlign: 'center', padding: '80px 24px',
          borderTop: '1px solid var(--border)'
        }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
            Ready to <span className='sp-text'>build something amazing?</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '16px' }}>
            Join developers using GenUI to build faster
          </p>
          <button
            onClick={() => navigate(user ? '/generate' : '/register')}
            className='btn-primary'
            style={{ padding: '14px 36px', fontSize: '16px', borderRadius: '12px' }}
          >
            <BsStars style={{ display: 'inline', marginRight: '8px' }} />
            {user ? 'Go to Generator' : 'Start for Free'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Landing