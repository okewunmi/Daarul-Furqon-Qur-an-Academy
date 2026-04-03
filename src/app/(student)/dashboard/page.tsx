'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, Video, Bell, BookOpen, Clock, Users, ArrowRight, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate, formatTime } from '@/lib/utils'
import { PROGRAM_LABELS } from '@/types'
import type { Profile, Student, Session, Announcement, Group } from '@/types'

export default function StudentDashboard() {
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: prof }, { data: stu }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('students').select('*, group:groups(*)').eq('id', user.id).single(),
      ])
      setProfile(prof)
      setStudent(stu)
      if (stu?.group) setGroup(stu.group as unknown as Group)

      if (stu?.group_id) {
        const { data: sessions } = await supabase
          .from('sessions')
          .select('*')
          .eq('group_id', stu.group_id)
          .eq('is_cancelled', false)
          .gte('session_date', new Date().toISOString().split('T')[0])
          .order('session_date', { ascending: true })
          .limit(3)
        setUpcomingSessions(sessions || [])
      }

      const { data: ann } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .or(`target_group.is.null,target_group.eq.${stu?.group_id}`)
        .order('created_at', { ascending: false })
        .limit(3)
      setAnnouncements(ann || [])

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

  const nextSession = upcomingSessions[0]

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Welcome header */}
      <div className="geometric-bg rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-gold-400 text-sm font-medium mb-1">
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
            </p>
            <h1 className="font-display text-2xl font-bold">
              As-salamu alaykum, {profile?.full_name?.split(' ')[0]}!
            </h1>
            <p className="text-emerald-300 text-sm mt-1">
              {group ? `${group.name} · ${student?.program ? PROGRAM_LABELS[student.program] : ''}` : 'Welcome to Daarul Furqon'}
            </p>
          </div>
          {nextSession && (
            <a
              href={nextSession.meet_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gold-400 text-emerald-900 font-semibold px-5 py-2.5 rounded-xl hover:bg-gold-500 transition-all text-sm"
            >
              <Video className="w-4 h-4" />
              Join Next Class
            </a>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: 'Program', value: student?.program ? PROGRAM_LABELS[student.program].split(' ')[0] : '—', color: 'text-emerald-600' },
          { icon: Users, label: 'My Group', value: group?.name?.split(' ').slice(-2).join(' ') || '—', color: 'text-gold-600' },
          { icon: Calendar, label: 'Schedule', value: student?.day_preference === 'weekdays' ? 'Weekdays' : student?.day_preference === 'weekends' ? 'Weekends' : '—', color: 'text-blue-600' },
          { icon: Clock, label: 'Class Time', value: student?.preferred_time ? `${student.preferred_time} WAT` : '—', color: 'text-purple-600' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100">
            <Icon className={`w-5 h-5 ${color} mb-2`} />
            <div className="text-xs text-gray-500 mb-0.5">{label}</div>
            <div className="font-semibold text-gray-800 text-sm">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming sessions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-emerald-900">Upcoming Classes</h2>
            <Link href="/dashboard/schedule" className="text-emerald-600 text-sm hover:text-gold-600 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {upcomingSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No upcoming sessions scheduled yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map(session => (
                <div key={session.id} className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-emerald-900 text-sm">{session.title}</div>
                      <div className="text-emerald-600 text-xs mt-1">
                        {formatDate(session.session_date)} · {formatTime(session.start_time)}
                      </div>
                    </div>
                    <a
                      href={session.meet_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 shrink-0"
                    >
                      <Video className="w-3 h-3" />
                      Join
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-emerald-900">Announcements</h2>
            <Link href="/dashboard/announcements" className="text-emerald-600 text-sm hover:text-gold-600 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {announcements.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No announcements yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {announcements.map(ann => (
                <div
                  key={ann.id}
                  className={`p-4 rounded-xl text-sm priority-${ann.priority}`}
                >
                  <div className="flex items-start gap-2">
                    <Bell className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
                    <div>
                      <div className="font-semibold text-gray-800">{ann.title}</div>
                      <div className="text-gray-600 text-xs mt-1 line-clamp-2">{ann.content}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
