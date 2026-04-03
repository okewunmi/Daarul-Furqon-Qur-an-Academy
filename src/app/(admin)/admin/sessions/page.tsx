'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Video, Calendar, Clock, Edit2, X, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate, formatTime } from '@/lib/utils'
import type { Session, Group } from '@/types'

export default function AdminSessionsPage() {
  const supabase = createClient()
  const [sessions, setSessions] = useState<(Session & { group: Group })[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming')

  useEffect(() => {
    loadSessions()
  }, [filter])

  const loadSessions = async () => {
    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('sessions')
      .select('*, group:groups(*)')
      .order('session_date', { ascending: filter === 'upcoming' })
      .then(({ data }) => ({
        data: (data || []).filter(s =>
          filter === 'upcoming' ? s.session_date >= today : s.session_date < today
        )
      }))
    setSessions(data as any)
    setLoading(false)
  }

  const handleCancel = async (id: string, reason: string) => {
    await supabase.from('sessions').update({ is_cancelled: true, cancel_reason: reason }).eq('id', id)
    loadSessions()
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-emerald-900">Sessions</h1>
          <p className="text-gray-500 mt-1">Schedule and manage class sessions.</p>
        </div>
        <Link href="/admin/sessions/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Schedule Session
        </Link>
      </div>

      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        {(['upcoming', 'past'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              filter === f ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No {filter} sessions.</p>
          <Link href="/admin/sessions/new" className="btn-primary inline-flex items-center gap-2 mt-4">
            <Plus className="w-4 h-4" /> Schedule First Session
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map(session => (
            <div key={session.id} className={`bg-white rounded-2xl border p-5 ${session.is_cancelled ? 'border-red-100 opacity-70' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-gray-800">{session.title}</h3>
                    {session.is_cancelled && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Cancelled</span>}
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full capitalize">{session.group?.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(session.session_date)}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatTime(session.start_time)} – {formatTime(session.end_time)}</span>
                    <a href={session.meet_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-emerald-600 hover:text-gold-600">
                      <Video className="w-3.5 h-3.5" /> Meet Link
                    </a>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/sessions/${session.id}/edit`} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  {!session.is_cancelled && (
                    <button
                      onClick={() => {
                        const reason = prompt('Cancellation reason:')
                        if (reason) handleCancel(session.id, reason)
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
