'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { colors, fonts } from '@/styles/theme'
import { Bell, Search } from 'lucide-react'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/invoices': 'Invoices',
  '/invoices/new': 'New Invoice',
  '/clients': 'Clients',
  '/settings': 'Settings',
}

export default function Navbar() {
  const pathname = usePathname()
  const [userEmail, setUserEmail] = useState('')
  const title = pageTitles[pathname] ?? 'Invoice Platform'

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) setUserEmail(user.email)
    }
    getUser()
  }, [])

  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : 'U'

  return (
    <header style={{
      height: 68,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      borderBottom: `1px solid ${colors.borderPanel}`,
      background: colors.bgBase,
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>

      {/* Page Title */}
      <div>
        <h1 style={{
          fontFamily: fonts.heading,
          fontSize: 20,
          fontWeight: 800,
          color: colors.textPrimary,
          margin: 0,
          letterSpacing: '-0.3px',
        }}>{title}</h1>
      </div>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${colors.borderDefault}`,
          borderRadius: 10,
          padding: '8px 14px',
          cursor: 'pointer',
        }}>
          <Search size={15} color={colors.textMuted} />
          <span style={{
            color: colors.textMuted,
            fontSize: 13,
            fontFamily: fonts.body,
          }}>Search...</span>
          <span style={{
            color: colors.textDisabled,
            fontSize: 11,
            background: 'rgba(255,255,255,0.06)',
            padding: '2px 6px',
            borderRadius: 5,
            fontFamily: fonts.body,
          }}>⌘K</span>
        </div>

        {/* Bell */}
        <div style={{
          width: 38,
          height: 38,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${colors.borderDefault}`,
          borderRadius: 10,
          cursor: 'pointer',
          position: 'relative',
        }}>
          <Bell size={17} color={colors.textMuted} />
          <div style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 7,
            height: 7,
            background: colors.primary,
            borderRadius: '50%',
            border: `2px solid ${colors.bgBase}`,
          }} />
        </div>

        {/* Avatar */}
        <div style={{
          width: 38,
          height: 38,
          background: colors.primarySubtle,
          border: `1px solid ${colors.primaryBorder}`,
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <span style={{
            fontFamily: fonts.heading,
            fontSize: 13,
            fontWeight: 800,
            color: colors.primary,
          }}>{initials}</span>
        </div>

      </div>
    </header>
  )
}