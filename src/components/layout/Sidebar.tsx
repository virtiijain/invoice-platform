'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { colors, fonts, gradients } from '@/styles/theme'
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Plus,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/invoices', label: 'Invoices', icon: FileText },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        width: expanded ? 220 : 68,
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e1b2e 100%)',
        borderRight: `1px solid ${colors.borderPanel}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s cubic-bezier(.22,1,.36,1)',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{
        padding: '20px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: `1px solid ${colors.borderPanel}`,
        minHeight: 68,
      }}>
        <div style={{
          width: 36,
          height: 36,
          background: gradients.primary,
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
        }}>⚡</div>
        {expanded && (
          <span style={{
            fontFamily: fonts.heading,
            fontSize: 18,
            fontWeight: 800,
            color: colors.textPrimary,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}>InvoicePro</span>
        )}
      </div>

      {/* New Invoice Button */}
      <div style={{ padding: '12px 12px 4px' }}>
        <Link href="/invoices/new" style={{ textDecoration: 'none' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            background: gradients.primary,
            borderRadius: 10,
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            boxShadow: '0 4px 12px rgba(249,115,22,0.3)',
          }}>
            <Plus size={18} color="#fff" style={{ flexShrink: 0 }} />
            {expanded && (
              <span style={{
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                fontFamily: fonts.body,
              }}>New Invoice</span>
            )}
          </div>
        </Link>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: isActive ? colors.primarySubtle : 'transparent',
                border: `1px solid ${isActive ? colors.primaryBorder : 'transparent'}`,
              }}>
                <Icon
                  size={20}
                  color={isActive ? colors.primary : colors.textMuted}
                  style={{ flexShrink: 0 }}
                />
                {expanded && (
                  <span style={{
                    color: isActive ? colors.textPrimary : colors.textSecondary,
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 400,
                    whiteSpace: 'nowrap',
                    fontFamily: fonts.body,
                    flex: 1,
                  }}>{label}</span>
                )}
                {expanded && isActive && (
                  <ChevronRight size={14} color={colors.primary} />
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px', borderTop: `1px solid ${colors.borderPanel}` }}>
        <div
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 12px',
            borderRadius: 10,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut size={20} color={colors.error} style={{ flexShrink: 0 }} />
          {expanded && (
            <span style={{
              color: colors.error,
              fontSize: 14,
              fontWeight: 500,
              whiteSpace: 'nowrap',
              fontFamily: fonts.body,
            }}>Logout</span>
          )}
        </div>
      </div>
    </aside>
  )
}