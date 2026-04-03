'use client'

import { useEffect, useState } from 'react'
import { Loader2, Save, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PROGRAM_LABELS } from '@/types'
import { formatDate } from '@/lib/utils'
import type { Profile, Student, Group } from '@/types'

export default function ProfilePage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [student, setStudent] = useState<(Student & { group?: Group }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: prof }, { data: stu }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('students').select('*, group:groups(*)').eq('id', user.id).single(),
      ])

      setProfile(prof)
      setStudent(stu as any)
      setPhone(prof?.phone || '')
      setCountry(prof?.country || '')
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('profiles').update({ phone, country }).eq('id', user!.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-emerald-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Your personal information and enrollment details.</p>
      </div>

      {/* Avatar + name */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-white font-display font-bold text-3xl">
            {profile?.full_name?.charAt(0)}
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-emerald-900">{profile?.full_name}</h2>
            <p className="text-gray-500">{profile?.email}</p>
            <span className="badge-emerald mt-1 inline-block capitalize">{profile?.age_group}</span>
          </div>
        </div>
      </div>

      {/* Enrollment details */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-emerald-800 mb-4 pb-3 border-b">Enrollment Details</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: 'Program', value: student?.program ? PROGRAM_LABELS[student.program] : '—' },
            { label: 'Group', value: (student?.group as any)?.name || 'Unassigned' },
            { label: 'Schedule', value: student?.day_preference ? `${student.day_preference === 'weekdays' ? 'Weekdays' : 'Weekends'}` : '—' },
            { label: 'Class Time', value: student?.preferred_time ? `${student.preferred_time} WAT` : '—' },
            { label: 'Payment Plan', value: student?.payment_plan ? student.payment_plan.charAt(0).toUpperCase() + student.payment_plan.slice(1) : '—' },
            { label: 'Status', value: student?.status || '—' },
            { label: 'Enrolled On', value: student?.enrollment_date ? formatDate(student.enrollment_date) : '—' },
            { label: 'Cycle Starts', value: student?.cycle_start_date ? formatDate(student.cycle_start_date) : '—' },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</div>
              <div className="text-gray-800 font-medium mt-0.5 capitalize">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Editable fields */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-emerald-800 mb-4 pb-3 border-b">Update Contact Info</h3>
        <div className="space-y-4">
          <div>
            <label className="label-field">Phone / WhatsApp</label>
            <input className="input-field" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+234 ..." />
          </div>
          <div>
            <label className="label-field">Country</label>
            <input className="input-field" value={country} onChange={e => setCountry(e.target.value)} placeholder="Nigeria" />
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
