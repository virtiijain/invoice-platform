'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { colors, fonts, gradients } from '@/styles/theme'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async () => {
    setError('')
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    setSuccess(true)
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: '12px',
    padding: '14px 16px',
    color: '#f1f5f9',
    fontSize: '14px',
    fontFamily: fonts.body,
    outline: 'none',
    transition: 'all 0.25s',
    boxSizing: 'border-box' as const,
  }

  if (success) {
    return (
      <div style={{ fontFamily: fonts.body, minHeight: '100vh', background: colors.bgBase, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap');`}</style>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{ width: 72, height: 72, background: colors.primarySubtle, border: `1px solid ${colors.primaryBorder}`, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 28px' }}>📧</div>
          <h2 style={{ fontFamily: fonts.heading, fontSize: 30, fontWeight: 800, color: colors.textPrimary, marginBottom: 12, letterSpacing: '-0.5px' }}>Check your inbox!</h2>
          <p style={{ color: colors.textMuted, fontSize: 15, lineHeight: 1.75, marginBottom: 36 }}>
            We sent a confirmation link to <span style={{ color: colors.primary, fontWeight: 500 }}>{email}</span>. Click the link to activate your account.
          </p>
          <button onClick={() => router.push('/login')}
            style={{ padding: '14px 36px', borderRadius: 12, background: gradients.primary, color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer', fontFamily: fonts.body, boxShadow: '0 4px 20px rgba(249,115,22,0.35)' }}>
            Back to Login →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: fonts.body, minHeight: '100vh', display: 'flex' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        input::placeholder { color: rgba(241,245,249,0.4) !important; }
        input:focus { border-color: rgba(249,115,22,0.7) !important; background: rgba(255,255,255,0.11) !important; box-shadow: 0 0 0 3px rgba(249,115,22,0.15) !important; }
        .btn-signup { width:100%; padding:14px 16px; border-radius:12px; font-weight:600; font-size:15px; background:linear-gradient(135deg,#fb923c,#f97316); color:#fff; border:none; cursor:pointer; transition:all 0.25s; font-family:'DM Sans',sans-serif; box-shadow:0 4px 20px rgba(249,115,22,0.35); }
        .btn-signup:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 30px rgba(249,115,22,0.5); }
        .btn-signup:disabled { opacity:0.45; cursor:not-allowed; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes floatA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(10px,-15px)} }
        @keyframes floatB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-8px,12px)} }
        .f1{animation:fadeUp 0.65s cubic-bezier(.22,1,.36,1) 0.1s forwards;opacity:0}
        .f2{animation:fadeUp 0.65s cubic-bezier(.22,1,.36,1) 0.2s forwards;opacity:0}
        .f3{animation:fadeUp 0.65s cubic-bezier(.22,1,.36,1) 0.3s forwards;opacity:0}
        .f4{animation:fadeUp 0.65s cubic-bezier(.22,1,.36,1) 0.4s forwards;opacity:0}
        .f5{animation:fadeUp 0.65s cubic-bezier(.22,1,.36,1) 0.5s forwards;opacity:0}
        .f6{animation:fadeUp 0.65s cubic-bezier(.22,1,.36,1) 0.6s forwards;opacity:0}
      `}</style>

      {/* Left Panel */}
      <div className="hidden lg:flex"
        style={{ width:'46%', padding:'56px', flexDirection:'column', justifyContent:'space-between', position:'relative', overflow:'hidden', background: gradients.bgLeft, borderRight:`1px solid ${colors.borderPanel}` }}>

        <div style={{ position:'absolute', top:'15%', left:'5%', width:260, height:260, borderRadius:'50%', background:`radial-gradient(circle, ${colors.primarySubtle} 0%, transparent 70%)`, animation:'floatA 6s ease-in-out infinite' }} />
        <div style={{ position:'absolute', bottom:'18%', right:'5%', width:180, height:180, borderRadius:'50%', background:'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)', animation:'floatB 8s ease-in-out infinite' }} />

        {/* Logo */}
        <div style={{ position:'relative', zIndex:10, display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:36, height:36, background:gradients.primary, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>⚡</div>
          <span style={{ fontFamily:fonts.heading, fontSize:20, fontWeight:800, color:colors.textPrimary }}>InvoicePro</span>
        </div>

        {/* Headline + Features */}
        <div style={{ position:'relative', zIndex:10 }}>
          <h1 style={{ fontFamily:fonts.heading, fontSize:42, fontWeight:800, color:colors.textPrimary, lineHeight:1.15, marginBottom:18, letterSpacing:'-1px' }}>
            Start invoicing<br />
            <span style={{ WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundImage:gradients.primaryText, backgroundClip:'text' }}>
              in minutes.
            </span>
          </h1>
          <p style={{ color:colors.textMuted, fontSize:15, lineHeight:1.75, marginBottom:32, maxWidth:300 }}>
            Everything you need to manage clients and get paid on time.
          </p>
          {['Create unlimited invoices', 'Auto GST calculation', 'PDF export & email', 'Client management dashboard'].map(f => (
            <div key={f} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
              <div style={{ width:22, height:22, borderRadius:'50%', background:colors.primarySubtle, border:`1px solid ${colors.primaryBorder}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:colors.primary, flexShrink:0, fontWeight:700 }}>✓</div>
              <span style={{ color:colors.textMuted, fontSize:14 }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ position:'relative', zIndex:10, display:'flex', gap:32 }}>
          {[['Free','Forever'],['5 min','Setup'],['No CC','Required']].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontFamily:fonts.heading, fontSize:20, fontWeight:800, color:colors.primary }}>{num}</div>
              <div style={{ color:colors.textMuted, fontSize:12, marginTop:2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:32, background:colors.bgBase }}>
        <div style={{ width:'100%', maxWidth:360 }}>

          <div className="f1" style={{ marginBottom:36 }}>
            <h2 style={{ fontFamily:fonts.heading, fontSize:30, fontWeight:800, color:colors.textPrimary, marginBottom:8, letterSpacing:'-0.5px' }}>Create account</h2>
            <p style={{ color:colors.textMuted, fontSize:14, margin:0 }}>Free forever. No credit card required.</p>
          </div>

          {error && (
            <div style={{ background:colors.errorSubtle, border:`1px solid ${colors.errorBorder}`, borderRadius:12, padding:'12px 16px', marginBottom:20 }}>
              <p style={{ color:colors.error, fontSize:13, margin:0 }}>{error}</p>
            </div>
          )}

          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <div className="f2">
              <label style={{ display:'block', color:colors.textSecondary, fontSize:13, fontWeight:500, marginBottom:8 }}>Email address</label>
              <input style={inputStyle} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="f3">
              <label style={{ display:'block', color:colors.textSecondary, fontSize:13, fontWeight:500, marginBottom:8 }}>Password</label>
              <input style={inputStyle} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="f4">
              <label style={{ display:'block', color:colors.textSecondary, fontSize:13, fontWeight:500, marginBottom:8 }}>Confirm password</label>
              <input style={inputStyle} type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSignup()} />
            </div>
            <div className="f5" style={{ marginTop:4 }}>
              <button className="btn-signup" onClick={handleSignup} disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account →'}
              </button>
            </div>
          </div>

          <p className="f6" style={{ textAlign:'center', marginTop:28, color:colors.textDisabled, fontSize:14 }}>
            Already have an account?{' '}
            <a href="/login" style={{ color:colors.primary, textDecoration:'none', fontWeight:600 }}>Sign in</a>
          </p>
        </div>
      </div>
    </div>
  )
}