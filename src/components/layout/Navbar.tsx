'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { colors, fonts } from '@/styles/theme'
import { Bell, Search, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/invoices': 'Invoices',
  '/invoices/new': 'New Invoice',
  '/clients': 'Clients',
  '/settings': 'Settings',
}

type Notification = {
  id: string
  title: string
  message: string
  type: string
  unread: boolean
  created_at: string
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const title = pageTitles[pathname] ?? 'Invoice Platform'

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) setUserEmail(user.email)
    }
    getUser()
  }, [])

  // Fetch + Realtime notifications
  useEffect(() => {
    const fetchAndSubscribe = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch existing
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (data) setNotifications(data)

      // Realtime subscribe
      const channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setNotifications(prev => [payload.new as Notification, ...prev.slice(0, 9)])
          }
        )
        .subscribe()

      return () => { supabase.removeChannel(channel) }
    }

    fetchAndSubscribe()
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const markAllRead = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase
      .from('notifications')
      .update({ unread: false })
      .eq('user_id', user.id)
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : 'U'
  const unreadCount = notifications.filter(n => n.unread).length

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(mins / 60)
    const days = Math.floor(hours / 24)
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (mins > 0) return `${mins}m ago`
    return 'Just now'
  }

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: 48,
    right: 0,
    background: '#1a1f2e',
    border: `1px solid ${colors.borderDefault}`,
    borderRadius: 14,
    zIndex: 200,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    overflow: 'hidden',
  }

  return (
    <header style={{
      height: 68,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: isMobile ? '0 16px' : '0 28px',
      borderBottom: `1px solid ${colors.borderPanel}`,
      background: colors.bgBase,
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>

      {/* Page Title */}
      <h1 style={{
        fontFamily: fonts.heading,
        fontSize: isMobile ? 18 : 20,
        fontWeight: 800,
        color: colors.textPrimary,
        margin: 0,
        letterSpacing: '-0.3px',
      }}>{title}</h1>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

        {/* Search — desktop only */}
        {!isMobile && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${colors.borderDefault}`,
            borderRadius: 10, padding: '8px 14px', cursor: 'pointer',
          }}>
            <Search size={15} color={colors.textMuted} />
            <span style={{ color: colors.textMuted, fontSize: 13, fontFamily: fonts.body }}>Search...</span>
            <span style={{
              color: colors.textDisabled, fontSize: 11,
              background: 'rgba(255,255,255,0.06)',
              padding: '2px 6px', borderRadius: 5, fontFamily: fonts.body,
            }}>⌘K</span>
          </div>
        )}

        {/* Bell */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <div
            onClick={() => { setShowNotifications(p => !p); setShowProfile(false) }}
            style={{
              width: 38, height: 38,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${colors.borderDefault}`,
              borderRadius: 10, cursor: 'pointer', position: 'relative',
            }}>
            <Bell size={17} color={colors.textMuted} />
            {unreadCount > 0 && (
              <div style={{
                position: 'absolute', top: 7, right: 7,
                width: 7, height: 7,
                background: colors.primary, borderRadius: '50%',
                border: `2px solid ${colors.bgBase}`,
              }} />
            )}
          </div>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div style={{ ...dropdownStyle, width: isMobile ? 300 : 320 }}>
              <div style={{ padding: '14px 16px', borderBottom: `1px solid ${colors.borderDefault}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: colors.textPrimary, fontSize: 14, fontWeight: 600, fontFamily: fonts.body }}>Notifications</span>
                {unreadCount > 0 && (
                  <span style={{
                    background: colors.primarySubtle, border: `1px solid ${colors.primaryBorder}`,
                    color: colors.primary, fontSize: 11, fontWeight: 600,
                    padding: '2px 8px', borderRadius: 20, fontFamily: fonts.body,
                  }}>{unreadCount} new</span>
                )}
              </div>

              {notifications.length === 0 ? (
                <div style={{ padding: '24px 16px', textAlign: 'center' }}>
                  <p style={{ color: colors.textMuted, fontSize: 13, fontFamily: fonts.body, margin: 0 }}>
                    No notifications yet
                  </p>
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} style={{
                    padding: '12px 16px',
                    borderBottom: `1px solid ${colors.borderDefault}`,
                    background: n.unread ? 'rgba(249,115,22,0.04)' : 'transparent',
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    cursor: 'pointer',
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      flexShrink: 0, marginTop: 5,
                      background: n.unread ? colors.primary : 'transparent',
                      border: n.unread ? 'none' : `1px solid ${colors.borderDefault}`,
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: colors.textPrimary, fontSize: 13, margin: '0 0 3px', fontFamily: fonts.body }}>{n.title}</p>
                      {n.message && (
                        <p style={{ color: colors.textMuted, fontSize: 11, margin: '0 0 3px', fontFamily: fonts.body }}>{n.message}</p>
                      )}
                      <p style={{ color: colors.textDisabled, fontSize: 11, margin: 0, fontFamily: fonts.body }}>
                        {timeAgo(n.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}

              {notifications.length > 0 && (
                <div style={{ padding: '10px 16px', textAlign: 'center' }}>
                  <span
                    onClick={markAllRead}
                    style={{ color: colors.primary, fontSize: 13, fontFamily: fonts.body, cursor: 'pointer' }}>
                    Mark all as read
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <div
            onClick={() => { setShowProfile(p => !p); setShowNotifications(false) }}
            style={{
              width: 38, height: 38,
              background: colors.primarySubtle,
              border: `1px solid ${colors.primaryBorder}`,
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
            <span style={{ fontFamily: fonts.heading, fontSize: 13, fontWeight: 800, color: colors.primary }}>
              {initials}
            </span>
          </div>

          {/* Profile Dropdown */}
          {showProfile && (
            <div style={{ ...dropdownStyle, width: 220 }}>
              <div style={{ padding: '14px 16px', borderBottom: `1px solid ${colors.borderDefault}` }}>
                <div style={{
                  width: 36, height: 36,
                  background: colors.primarySubtle,
                  border: `1px solid ${colors.primaryBorder}`,
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 10,
                }}>
                  <span style={{ fontFamily: fonts.heading, fontSize: 14, fontWeight: 800, color: colors.primary }}>{initials}</span>
                </div>
                <p style={{ color: colors.textPrimary, fontSize: 13, fontWeight: 600, margin: '0 0 2px', fontFamily: fonts.body }}>
                  {userEmail.split('@')[0]}
                </p>
                <p style={{ color: colors.textMuted, fontSize: 11, margin: 0, fontFamily: fonts.body }}>
                  {userEmail}
                </p>
              </div>

              <div style={{ padding: '8px 0' }}>
                <Link href="/settings" style={{ textDecoration: 'none' }} onClick={() => setShowProfile(false)}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Settings size={15} color={colors.textMuted} />
                    <span style={{ color: colors.textSecondary, fontSize: 13, fontFamily: fonts.body }}>Settings</span>
                  </div>
                </Link>

                <div
                  onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <LogOut size={15} color={colors.error} />
                  <span style={{ color: colors.error, fontSize: 13, fontFamily: fonts.body }}>Logout</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}