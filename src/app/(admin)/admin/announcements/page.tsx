'use client'

import { useEffect, useState } from 'react'
import { Plus, Bell, Trash2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import type { Announcement, Group } from '@/types'
import { cn } from '@/lib/utils'

export default function AdminAnnouncementsPage() {
  const supabase = createClient()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', priority: 'normal', target_group: '' })

  useEffect(() => {
    load()
    supabase.from('groups').select('*').eq('is_active', true).then(({ data }) => setGroups(data || []))
  }, [])

  const load = async () => {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
    setAnnouncements(data || [])
    setLoading(false)
  }

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('announcements').insert({
      title: form.title,
      content: form.content,
      priority: form.priority,
      target_group: form.target_group || null,
      author_id: user?.id,
      is_active: true,
    })
    setForm({ title: '', content: '', priority: 'normal', target_group: '' })
    setShowForm(false)
    setSaving(false)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement?')) return
    await supabase.from('announcements').delete().eq('id', id)
    load()
  }

  const handleToggle = async (id: string, is_active: boolean) => {
    await supabase.from('announcements').update({ is_active: !is_active }).eq('id', id)
    load()
  }

  const priorityColors: Record<string, string> = {
    urgent: 'border-red-200 bg-red-50',
    important: 'border-gold-200 bg-gold-50',
    normal: 'border-emerald-100 bg-emerald-50',
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-emerald-900">Announcements</h1>
          <p className="text-gray-500 mt-1">Post updates to all students or specific groups.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-emerald-200 p-6 space-y-4">
          <h3 className="font-semibold text-emerald-800">New Announcement</h3>
          <div>
            <label className="label-field">Title *</label>
            <input className="input-field" value={form.title} onChange={e => update('title', e.target.value)} required />
          </div>
          <div>
            <label className="label-field">Message *</label>
            <textarea className="input-field min-h-24 resize-none" value={form.content} onChange={e => update('content', e.target.value)} required />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Priority</label>
              <select className="input-field" value={form.priority} onChange={e => update('priority', e.target.value)}>
                <option value="normal">Normal</option>
                <option value="important">Important</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="label-field">Target (leave blank for all)</label>
              <select className="input-field" value={form.target_group} onChange={e => update('target_group', e.target.value)}>
                <option value="">All Students</option>
                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Posting...' : 'Post Announcement'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No announcements yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map(ann => (
            <div key={ann.id} className={cn('rounded-2xl border p-5', priorityColors[ann.priority], !ann.is_active && 'opacity-50')}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-gray-800">{ann.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                      ann.priority === 'urgent' ? 'bg-red-100 text-red-600' :
                      ann.priority === 'important' ? 'bg-gold-100 text-gold-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>{ann.priority}</span>
                    {!ann.is_active && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inactive</span>}
                  </div>
                  <p className="text-gray-600 text-sm">{ann.content}</p>
                  <p className="text-gray-400 text-xs mt-2">{formatDate(ann.created_at)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(ann.id, ann.is_active)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium ${ann.is_active ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                  >
                    {ann.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => handleDelete(ann.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
