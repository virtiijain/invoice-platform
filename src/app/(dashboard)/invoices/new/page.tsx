'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { colors, fonts, gradients } from '@/styles/theme'
import { Plus, Trash2, FileText } from 'lucide-react'

type Client = { id: string; name: string; email: string }
type Item = { description: string; quantity: number; rate: number; amount: number }

export default function NewInvoicePage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    client_id: '',
    invoice_number: `INV-${Date.now().toString().slice(-6)}`,
    due_date: '',
    notes: '',
    tax_rate: 18,
    status: 'unpaid',
  })

  const [items, setItems] = useState<Item[]>([
    { description: '', quantity: 1, rate: 0, amount: 0 }
  ])

  useEffect(() => {
    fetch('/api/clients').then(r => r.json()).then(setClients)
  }, [])

  const updateItem = (index: number, field: keyof Item, value: string | number) => {
    setItems(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      const q = Number(updated[index].quantity)
      const r = Number(updated[index].rate)
      updated[index].amount = q * r
      return updated
    })
  }

  const addItem = () => setItems(prev => [...prev, { description: '', quantity: 1, rate: 0, amount: 0 }])
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i))

  const subtotal = items.reduce((sum, i) => sum + i.amount, 0)
  const taxAmount = (subtotal * form.tax_rate) / 100
  const total = subtotal + taxAmount

  const handleSubmit = async () => {
    if (!form.client_id) { setError('Client select karo'); return }
    if (items.some(i => !i.description)) { setError('Sab items ki description bharo'); return }
    setSaving(true)
    setError('')

    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        subtotal,
        tax_amount: taxAmount,
        total,
        issue_date: new Date().toISOString().split('T')[0],
        items,
      }),
    })

    if (res.ok) {
      router.push('/invoices')
    } else {
      const data = await res.json()
      setError(data.error ?? 'Kuch gadbad ho gayi')
    }
    setSaving(false)
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

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        input::placeholder, textarea::placeholder { color: rgba(241,245,249,0.3) !important; }
        input:focus, select:focus, textarea:focus { border-color: rgba(249,115,22,0.6) !important; box-shadow: 0 0 0 3px rgba(249,115,22,0.1) !important; }
        select option { background: #1a1f2e; color: white; }
      `}</style>

      {error && (
        <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
          <p style={{ color: '#f87171', fontSize: 14, margin: 0, fontFamily: fonts.body }}>{error}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Invoice Details */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${colors.borderDefault}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontFamily: fonts.heading, fontSize: 16, fontWeight: 700, color: colors.textPrimary, margin: '0 0 20px' }}>Invoice Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Invoice Number</label>
              <input style={inputStyle} value={form.invoice_number}
                onChange={e => setForm(p => ({ ...p, invoice_number: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Due Date</label>
              <input style={inputStyle} type="date" value={form.due_date}
                onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select style={inputStyle} value={form.status}
                onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>

        {/* Client */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${colors.borderDefault}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontFamily: fonts.heading, fontSize: 16, fontWeight: 700, color: colors.textPrimary, margin: '0 0 20px' }}>Client</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Select Client</label>
              <select style={inputStyle} value={form.client_id}
                onChange={e => setForm(p => ({ ...p, client_id: e.target.value }))}>
                <option value="">-- Client chuno --</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Tax (%)</label>
              <input style={inputStyle} type="number" value={form.tax_rate}
                onChange={e => setForm(p => ({ ...p, tax_rate: Number(e.target.value) }))} />
            </div>
            <div>
              <label style={labelStyle}>Notes</label>
              <textarea
                style={{ ...inputStyle, resize: 'none', height: 80 } as React.CSSProperties}
                placeholder="Payment terms, bank details..."
                value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${colors.borderDefault}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontFamily: fonts.heading, fontSize: 16, fontWeight: 700, color: colors.textPrimary, margin: 0 }}>Line Items</h3>
          <button onClick={addItem} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            background: colors.primarySubtle, border: `1px solid ${colors.primaryBorder}`,
            color: colors.primary, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: fonts.body,
          }}>
            <Plus size={14} /> Add Item
          </button>
        </div>

        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 40px', gap: 10, marginBottom: 10 }}>
          {['Description', 'Qty', 'Rate (₹)', 'Amount (₹)', ''].map(h => (
            <span key={h} style={{ color: colors.textMuted, fontSize: 12, fontWeight: 600, fontFamily: fonts.body, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
          ))}
        </div>

        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 40px', gap: 10, alignItems: 'center' }}>
              <input style={inputStyle} placeholder="Web design, consulting..."
                value={item.description}
                onChange={e => updateItem(i, 'description', e.target.value)} />
              <input style={inputStyle} type="number" min="1"
                value={item.quantity}
                onChange={e => updateItem(i, 'quantity', e.target.value)} />
              <input style={inputStyle} type="number" min="0"
                value={item.rate}
                onChange={e => updateItem(i, 'rate', e.target.value)} />
              <div style={{ ...inputStyle, background: 'rgba(255,255,255,0.02)', color: colors.primary, fontWeight: 600 }}>
                ₹{item.amount.toLocaleString('en-IN')}
              </div>
              {items.length > 1 && (
                <button onClick={() => removeItem(i)} style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}>
                  <Trash2 size={14} color="#f87171" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Totals */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${colors.borderDefault}`, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Subtotal', value: subtotal },
              { label: `Tax (${form.tax_rate}%)`, value: taxAmount },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: colors.textMuted, fontSize: 14, fontFamily: fonts.body }}>{label}</span>
                <span style={{ color: colors.textSecondary, fontSize: 14, fontFamily: fonts.body }}>₹{value.toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: `1px solid ${colors.borderDefault}` }}>
              <span style={{ color: colors.textPrimary, fontSize: 16, fontWeight: 700, fontFamily: fonts.heading }}>Total</span>
              <span style={{ color: colors.primary, fontSize: 18, fontWeight: 800, fontFamily: fonts.heading }}>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button onClick={() => router.push('/invoices')} style={{
          padding: '12px 24px', borderRadius: 10,
          background: 'rgba(255,255,255,0.05)', border: `1px solid ${colors.borderDefault}`,
          color: colors.textSecondary, fontSize: 14, fontWeight: 500,
          cursor: 'pointer', fontFamily: fonts.body,
        }}>Cancel</button>
        <button onClick={handleSubmit} disabled={saving} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '12px 28px', borderRadius: 10,
          background: gradients.primary, border: 'none',
          color: '#fff', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', fontFamily: fonts.body,
          boxShadow: '0 4px 12px rgba(249,115,22,0.3)',
          opacity: saving ? 0.6 : 1,
        }}>
          <FileText size={16} />
          {saving ? 'Saving...' : 'Create Invoice'}
        </button>
      </div>
    </div>
  )
}