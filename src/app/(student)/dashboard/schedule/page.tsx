'use client'

import { useEffect, useState } from 'react'
import { Video, Calendar, Clock, ExternalLink, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate, formatTime } from '@/lib/utils'
import type { Session } from '@/types'

export default function SchedulePage() {
  const supabase = createClient()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: student } = await supabase
        .from('students')
        .select('group_id')
        .eq('id', user.id)
        .single()

      if (student?.group_id) {
        const today = new Date().toISOString().split('T')[0]
        const { data } = await supabase
          .from('sessions')
          .select('*')
          .eq('group_id', student.group_id)
          .order('session_date', { ascending: filter === 'upcoming' })

        setSessions(data || [])
      }
      setLoading(false)
    }
    load()
  }, [filter])

  const today = new Date().toISOString().split('T')[0]
  const filtered = sessions.filter(s =>
    filter === 'upcoming' ? s.session_date >= today : s.session_date < today
  )

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-emerald-900">My Class Schedule</h1>
        <p className="text-gray-500 mt-1">All your scheduled classes with Google Meet links.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        {(['upcoming', 'past'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              filter === f ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {f} Classes
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No {filter} classes found.</p>
          <p className="text-gray-400 text-sm mt-1">Sessions will appear here once your admin schedules them.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(session => {
            const isPast = session.session_date < today
            const isCancelled = session.is_cancelled
            return (
              <div
                key={session.id}
                className={`bg-white rounded-2xl border p-5 transition-all ${
                  isCancelled ? 'border-red-100 opacity-70' : 'border-gray-100 hover:border-emerald-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-emerald-900">{session.title}</h3>
                      {isCancelled && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Cancelled</span>
                      )}
                    </div>
                    {session.description && (
                      <p className="text-gray-500 text-sm mb-2">{session.description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        {formatDate(session.session_date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-emerald-500" />
                        {formatTime(session.start_time)} – {formatTime(session.end_time)}
                      </span>
                    </div>
                    {isCancelled && session.cancel_reason && (
                      <div className="mt-2 flex items-center gap-1.5 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {session.cancel_reason}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    {!isCancelled && (
                      <a
                        href={session.meet_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                          isPast
                            ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        <Video className="w-4 h-4" />
                        {isPast ? 'View Link' : 'Join Class'}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {session.recording_link && (
                      <a
                        href={session.recording_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-gold-600"
                      >
                        📹 Watch Recording
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
