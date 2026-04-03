'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BookOpen, LayoutDashboard, Users, Calendar, Bell,
  FileText, LogOut, Menu, X, Settings, ChevronRight
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Students',
    items: [
      { href: '/admin/students', label: 'All Students', icon: Users },
      { href: '/admin/registrations', label: 'Registrations', icon: FileText },
    ],
  },
  {
    label: 'Classes',
    items: [
      { href: '/admin/sessions', label: 'Sessions', icon: Calendar },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/announcements', label: 'Announcements', icon: Bell },
      { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
    ],
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [adminName, setAdminName] = useState('Admin')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('full_name, role').eq('id', user.id).single()
      if (data?.role !== 'admin') { router.push('/dashboard'); return }
      setAdminName(data.full_name)
    }
    load()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-emerald-800">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-emerald-900" />
          </div>
          <div>
            <div className="text-white font-display font-bold text-sm">Daarul Furqon</div>
            <div className="text-gold-400 text-xs">Admin Panel</div>
          </div>
        </Link>
      </div>

      {/* Admin chip */}
      <div className="mx-4 mt-4 p-3 rounded-xl bg-gold-400/10 border border-gold-400/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gold-400 flex items-center justify-center text-emerald-900 font-bold text-xs">
            {adminName.charAt(0)}
          </div>
          <div>
            <div className="text-gold-400 text-xs font-semibold uppercase tracking-wide">Administrator</div>
            <div className="text-white text-sm font-medium">{adminName}</div>
          </div>
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto mt-2">
        {navGroups.map(group => (
          <div key={group.label}>
            <p className="text-emerald-600 text-xs font-semibold uppercase tracking-widest px-3 mb-2">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + '/')
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                      active
                        ? 'bg-gold-400/15 text-gold-400 border border-gold-400/20'
                        : 'text-emerald-300 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                    {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-emerald-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-400 hover:text-red-400 hover:bg-red-400/5 transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-emerald-950 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-emerald-950 z-50 overflow-y-auto">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-white">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 gap-4 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <span className="text-sm text-gray-500 font-medium">Admin Panel</span>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
