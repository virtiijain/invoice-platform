'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { colors, fonts, gradients } from '@/styles/theme'
import { Plus, Search, Filter, Eye, Edit2, Trash2, FileText } from 'lucide-react'

type Invoice = {
  id: string
  invoice_number: string
  status: 'paid' | 'unpaid' | 'overdue'
  total: number
  due_date: string
  created_at: string
  clients: { name: string; email: string }
}

const statusColors = {
  paid: { color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.25)' },
  unpaid: { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.25)' },
  overdue: { color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.25)' },
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid' | 'overdue'>('all')

  const fetchInvoices = async () => {
    const res = await fetch('/api/invoices')
    const data = await res.json()
    setInvoices(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchInvoices() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this invoice?')) return
    await fetch(`/api/invoices/${id}`, { method: 'DELETE' })
    await fetchInvoices()
  }

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/invoices/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    await fetchInvoices()
  }

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.invoice_number?.toLowerCase().includes(search.toLowerCase()) ||
      inv.clients?.name?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        input::placeholder { color: rgba(241,245,249,0.3) !important; }
        .invoice-row:hover { background: rgba(255,255,255,0.06) !important; }
        .action-btn:hover { opacity: 0.75; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <p style={{ color: colors.textMuted, fontSize: 14, margin: 0, fontFamily: fonts.body }}>
          {invoices.length} total invoices
        </p>
        <Link href="/invoices/new" style={{ textDecoration: 'none' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 18px', borderRadius: 10,
            background: gradients.primary, color: '#fff',
            border: 'none', cursor: 'pointer',
            fontSize: 14, fontWeight: 600, fontFamily: fonts.body,
            boxShadow: '0 4px 12px rgba(249,115,22,0.3)',
          }}>
            <Plus size={16} /> New Invoice
          </button>
        </Link>
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${colors.borderDefault}`,
          borderRadius: 10, padding: '10px 14px',
        }}>
          <Search size={16} color={colors.textMuted} />
          <input
            style={{ background: 'none', border: 'none', outline: 'none', color: colors.textPrimary, fontSize: 14, fontFamily: fonts.body, width: '100%' }}
            placeholder="Search by invoice number or client..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', gap: 8 }}>
          {(['all', 'paid', 'unpaid', 'overdue'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: '10px 16px', borderRadius: 10, border: '1px solid',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
              fontFamily: fonts.body, textTransform: 'capitalize',
              background: statusFilter === s
                ? s === 'all' ? gradients.primary : statusColors[s]?.bg
                : 'rgba(255,255,255,0.04)',
              borderColor: statusFilter === s
                ? s === 'all' ? 'transparent' : statusColors[s]?.border ?? 'transparent'
                : colors.borderDefault,
              color: statusFilter === s
                ? s === 'all' ? '#fff' : statusColors[s]?.color
                : colors.textMuted,
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Invoice Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: colors.textMuted, fontFamily: fonts.body }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🧾</div>
          <p style={{ color: colors.textMuted, fontFamily: fonts.body, fontSize: 15 }}>
            {search || statusFilter !== 'all' ? 'No invoices found' : 'No invoices yet — create your first invoice!'}
          </p>
          <Link href="/invoices/new" style={{ textDecoration: 'none' }}>
            <button style={{
              marginTop: 16, padding: '10px 20px', borderRadius: 10,
              background: gradients.primary, color: '#fff',
              border: 'none', cursor: 'pointer', fontSize: 14,
              fontFamily: fonts.body, fontWeight: 600,
            }}>Create Invoice</button>
          </Link>
        </div>
      ) : (
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${colors.borderDefault}`,
          borderRadius: 16, overflow: 'hidden',
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr 120px',
            padding: '12px 20px',
            borderBottom: `1px solid ${colors.borderDefault}`,
            background: 'rgba(255,255,255,0.02)',
          }}>
            {['Invoice #', 'Client', 'Amount', 'Due Date', 'Status', 'Actions'].map(h => (
              <span key={h} style={{ color: colors.textMuted, fontSize: 12, fontWeight: 600, fontFamily: fonts.body, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
            ))}
          </div>

          {/* Table Rows */}
          {filtered.map(invoice => {
            const s = statusColors[invoice.status]
            return (
              <div key={invoice.id} className="invoice-row" style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr 120px',
                padding: '16px 20px',
                borderBottom: `1px solid ${colors.borderDefault}`,
                alignItems: 'center',
                transition: 'all 0.2s',
                background: 'transparent',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: colors.primarySubtle,
                    border: `1px solid ${colors.primaryBorder}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <FileText size={14} color={colors.primary} />
                  </div>
                  <span style={{ color: colors.textPrimary, fontSize: 14, fontWeight: 600, fontFamily: fonts.body }}>
                    {invoice.invoice_number}
                  </span>
                </div>

                <div>
                  <p style={{ color: colors.textPrimary, fontSize: 14, margin: '0 0 2px', fontFamily: fonts.body }}>{invoice.clients?.name}</p>
                  <p style={{ color: colors.textMuted, fontSize: 12, margin: 0, fontFamily: fonts.body }}>{invoice.clients?.email}</p>
                </div>

                <span style={{ color: colors.textPrimary, fontSize: 14, fontWeight: 600, fontFamily: fonts.body }}>
                  ₹{invoice.total?.toLocaleString('en-IN')}
                </span>

                <span style={{ color: colors.textMuted, fontSize: 13, fontFamily: fonts.body }}>
                  {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-IN') : '—'}
                </span>

                {/* Status Dropdown */}
                <select
                  value={invoice.status}
                  onChange={e => handleStatusChange(invoice.id, e.target.value)}
                  style={{
                    background: s?.bg, border: `1px solid ${s?.border}`,
                    color: s?.color, borderRadius: 8,
                    padding: '4px 10px', fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', fontFamily: fonts.body,
                    outline: 'none', width: 'fit-content',
                  }}
                >
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="overdue">Overdue</option>
                </select>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <Link href={`/invoices/${invoice.id}`}>
                    <button className="action-btn" style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: 'rgba(255,255,255,0.06)',
                      border: `1px solid ${colors.borderDefault}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                    }}>
                      <Eye size={14} color={colors.textMuted} />
                    </button>
                  </Link>
                  <button className="action-btn" onClick={() => handleDelete(invoice.id)} style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'rgba(248,113,113,0.1)',
                    border: '1px solid rgba(248,113,113,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}>
                    <Trash2 size={14} color="#f87171" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}