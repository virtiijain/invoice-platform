'use client'

import { useEffect, useState } from 'react'
import { colors, fonts, gradients } from '@/styles/theme'
import { Save, Building, FileText, Globe } from 'lucide-react'

type Settings = {
  company_name: string
  gst_number: string
  address: string
  email: string
  phone: string
  currency: string
  payment_terms: string
  invoice_prefix: string
  invoice_notes: string
}

const currencies = ['INR', 'USD', 'EUR', 'GBP', 'AED']

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    company_name: '',
    gst_number: '',
    address: '',
    email: '',
    phone: '',
    currency: 'INR',
    payment_terms: 'Due within 30 days',
    invoice_prefix: 'INV',
    invoice_notes: 'Thank you for your business!',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('invoice_settings')
    if (stored) setSettings(JSON.parse(stored))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    localStorage.setItem('invoice_settings', JSON.stringify(settings))
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.06)',
    border: `1px solid ${colors.borderDefault}`,
    borderRadius: '10px',
    padding: '10px 14px',
    color: colors.textPrimary,
    fontSize: '14px',
    fontFamily: fonts.body,
    outline: 'none',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    display: 'block' as const,
    color: colors.textSecondary,
    fontSize: '13px',
    fontWeight: 500,
    marginBottom: '7px',
    fontFamily: fonts.body,
  }

  const sections = [
    {
      title: 'Company Info',
      icon: Building,
      fields: [
        { label: 'Company Name', key: 'company_name', placeholder: 'Acme Pvt Ltd' },
        { label: 'Email', key: 'email', placeholder: 'billing@acme.com' },
        { label: 'Phone', key: 'phone', placeholder: '+91 98765 43210' },
        { label: 'Address', key: 'address', placeholder: 'Mumbai, Maharashtra' },
        { label: 'GST Number', key: 'gst_number', placeholder: '27AAPFU0939F1ZV' },
      ]
    },
    {
      title: 'Invoice Settings',
      icon: FileText,
      fields: [
        { label: 'Invoice Prefix', key: 'invoice_prefix', placeholder: 'INV' },
        { label: 'Default Notes', key: 'invoice_notes', placeholder: 'Thank you for your business!' },
      ]
    },
  ]

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        input::placeholder, textarea::placeholder { color: rgba(241,245,249,0.3) !important; }
        input:focus, select:focus, textarea:focus { border-color: rgba(249,115,22,0.6) !important; box-shadow: 0 0 0 3px rgba(249,115,22,0.1) !important; }
        select option { background: #1a1f2e; color: white; }
      `}</style>

      {/* Saved Toast */}
      {saved && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 100,
          background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)',
          borderRadius: 12, padding: '12px 20px',
          color: '#34d399', fontSize: 14, fontFamily: fonts.body, fontWeight: 500,
        }}>
          ✅ Settings saved!
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Company + Invoice sections */}
        {sections.map(({ title, icon: Icon, fields }) => (
          <div key={title} style={{
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${colors.borderDefault}`,
            borderRadius: 16, padding: isMobile ? 16 : 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: colors.primarySubtle, border: `1px solid ${colors.primaryBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={18} color={colors.primary} />
              </div>
              <h3 style={{ fontFamily: fonts.heading, fontSize: 16, fontWeight: 700, color: colors.textPrimary, margin: 0 }}>
                {title}
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
              {fields.map(({ label, key, placeholder }) => (
                <div key={key} style={{
                  gridColumn: !isMobile && (key === 'address' || key === 'invoice_notes') ? 'span 2' : 'span 1'
                }}>
                  <label style={labelStyle}>{label}</label>
                  {key === 'address' || key === 'invoice_notes' ? (
                    <textarea
                      style={{ ...inputStyle, resize: 'none', height: 80 } as React.CSSProperties}
                      placeholder={placeholder}
                      value={settings[key as keyof Settings]}
                      onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))}
                    />
                  ) : (
                    <input
                      style={inputStyle}
                      placeholder={placeholder}
                      value={settings[key as keyof Settings]}
                      onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Currency + Payment Terms */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${colors.borderDefault}`,
          borderRadius: 16, padding: isMobile ? 16 : 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: colors.primarySubtle, border: `1px solid ${colors.primaryBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Globe size={18} color={colors.primary} />
            </div>
            <h3 style={{ fontFamily: fonts.heading, fontSize: 16, fontWeight: 700, color: colors.textPrimary, margin: 0 }}>
              Preferences
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Currency</label>
              <select style={inputStyle} value={settings.currency}
                onChange={e => setSettings(p => ({ ...p, currency: e.target.value }))}>
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Payment Terms</label>
              <select style={inputStyle} value={settings.payment_terms}
                onChange={e => setSettings(p => ({ ...p, payment_terms: e.target.value }))}>
                {['Due on receipt', 'Due within 7 days', 'Due within 15 days', 'Due within 30 days', 'Due within 60 days'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: isMobile ? 'stretch' : 'flex-end' }}>
          <button onClick={handleSave} disabled={saving} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '12px 28px', borderRadius: 10,
            width: isMobile ? '100%' : 'auto',
            background: gradients.primary, border: 'none',
            color: '#fff', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: fonts.body,
            boxShadow: '0 4px 12px rgba(249,115,22,0.3)',
            opacity: saving ? 0.6 : 1,
          }}>
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </div>
    </div>
  )
}