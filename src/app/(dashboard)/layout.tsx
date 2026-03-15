'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'
import { colors } from '@/styles/theme'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace('/login')
      else setChecking(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace('/login')
      else setChecking(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (checking) return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: colors.bgBase,
    }}>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'sans-serif', fontSize: 14 }}>
        Loading...
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.bgBase }}>
      <Sidebar />
      <div style={{
        flex: 1,
        marginLeft: isMobile ? 0 : 68,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        <Navbar />
        <main style={{
          flex: 1,
          padding: isMobile ? '16px' : '28px',
          paddingBottom: isMobile ? '80px' : '28px',
          overflowY: 'auto',
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}