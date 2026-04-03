'use client'

import { useEffect, useState } from 'react'
import { Bell, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import type { Announcement } from '@/types'
import { cn } from '@/lib/utils'

export default function AnnouncementsPage() {
  const supabase = createClient()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: student } = await supabase
        .from('students').select('group_id').eq('id', user.id).single()

      const { data: ann } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .or(`target_group.is.null${student?.group_id ? `,target_group.eq.${student.group_id}` : ''}`)
        .order('created_at', { ascending: false })

      setAnnouncements(ann || [])

      const { data: reads } = await supabase
        .from('announcement_reads')
        .select('announcement_id')
        .eq('student_id', user.id)

      setReadIds(new Set(reads?.map(r => r.announcement_id) || []))

      // Mark all as read
      const unread = (ann || []).filter(a => !reads?.find(r => r.announcement_id === a.id))
      if (unread.length > 0) {
        await supabase.from('announcement_reads').insert(
          unread.map(a => ({ announcement_id: a.id, student_id: user.id }))
        )
      }

      setLoading(false)
    }
    load()
  }, [])

  const priorityLabel: Record<string, string> = {
    urgent: '🔴 Urgent',
    important: '🟡 Important',
    normal: '🟢 General',
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-emerald-900">Announcements</h1>
        <p className="text-gray-500 mt-1">Important updates from Daarul Furqon Academy.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No announcements yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map(ann => {
            const isRead = readIds.has(ann.id)
            return (
              <div
                key={ann.id}
                className={cn(
                  'rounded-2xl p-5 border-l-4',
                  ann.priority === 'urgent' ? 'bg-red-50 border-red-500' :
                  ann.priority === 'important' ? 'bg-gold-50 border-gold-500' :
                  'bg-emerald-50 border-emerald-500'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-medium text-gray-500">{priorityLabel[ann.priority]}</span>
                      {!isRead && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">New</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">{ann.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{ann.content}</p>
                    <p className="text-gray-400 text-xs mt-3">{formatDate(ann.created_at)}</p>
                  </div>
                  {isRead && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
