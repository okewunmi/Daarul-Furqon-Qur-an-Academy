'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, Calendar, Bell, FileText, Clock, ArrowRight, UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import type { Registration } from '@/types'

export default function AdminDashboard() {
  const supabase = createClient()
  const [stats, setStats] = useState({ students: 0, sessions: 0, pending: 0, announcements: 0 })
  const [pendingRegs, setPendingRegs] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [
        { count: students },
        { count: sessions },
        { count: pending },
        { count: announcements },
        { data: regs },
      ] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('sessions').select('*', { count: 'exact', head: true }).gte('session_date', new Date().toISOString().split('T')[0]),
        supabase.from('registrations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('announcements').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('registrations').select('*').eq('status', 'pending').order('created_at', { ascending: false }).limit(5),
      ])

      setStats({
        students: students || 0,
        sessions: sessions || 0,
        pending: pending || 0,
        announcements: announcements || 0,
      })
      setPendingRegs(regs || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="font-display text-3xl font-bold text-emerald-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage students, sessions, and academy content.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Active Students', value: stats.students, color: 'bg-emerald-50 text-emerald-600', href: '/admin/students' },
          { icon: Calendar, label: 'Upcoming Sessions', value: stats.sessions, color: 'bg-blue-50 text-blue-600', href: '/admin/sessions' },
          { icon: Clock, label: 'Pending Registrations', value: stats.pending, color: 'bg-gold-50 text-gold-600', href: '/admin/registrations' },
          { icon: Bell, label: 'Active Announcements', value: stats.announcements, color: 'bg-purple-50 text-purple-600', href: '/admin/announcements' },
        ].map(({ icon: Icon, label, value, color, href }) => (
          <Link key={label} href={href} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-emerald-200 transition-all group">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="font-display text-3xl font-bold text-gray-900">{value}</div>
            <div className="text-gray-500 text-sm mt-0.5 group-hover:text-emerald-600 transition-colors">{label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { href: '/admin/students/new', icon: UserPlus, label: 'Create Student Login', desc: 'Set up login credentials for a new student', color: 'bg-emerald-600' },
          { href: '/admin/sessions/new', icon: Calendar, label: 'Schedule a Session', desc: 'Add a new class with a Google Meet link', color: 'bg-blue-600' },
          { href: '/admin/announcements/new', icon: Bell, label: 'Post Announcement', desc: 'Send a message to all or specific groups', color: 'bg-gold-500' },
        ].map(({ href, icon: Icon, label, desc, color }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-emerald-200 transition-all group flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors">{label}</div>
              <div className="text-gray-500 text-xs mt-0.5">{desc}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 ml-auto transition-colors" />
          </Link>
        ))}
      </div>

      {/* Pending registrations */}
      {pendingRegs.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-emerald-900">Pending Registrations</h2>
            <Link href="/admin/registrations" className="text-sm text-emerald-600 hover:text-gold-600 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {pendingRegs.map(reg => (
              <div key={reg.id} className="flex items-center gap-4 p-3 rounded-xl bg-gold-50 border border-gold-100">
                <div className="w-9 h-9 rounded-full bg-gold-200 flex items-center justify-center text-gold-800 font-bold text-sm shrink-0">
                  {reg.full_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 text-sm">{reg.full_name}</div>
                  <div className="text-gray-500 text-xs capitalize">{reg.program} · {reg.day_preference} · {reg.preferred_time} WAT</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-gray-400">{formatDate(reg.created_at)}</div>
                  <Link
                    href={`/admin/registrations/${reg.id}`}
                    className="text-xs font-semibold text-emerald-700 hover:text-gold-600"
                  >
                    Process →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
