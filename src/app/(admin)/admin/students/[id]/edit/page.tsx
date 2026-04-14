'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Loader2, CheckCircle2, Eye, EyeOff,
  MessageCircle, UserX, UserCheck, Key, Save,
  User, Mail, Phone, Globe, BookOpen, Calendar, Clock, CreditCard
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PROGRAMS, PAYMENT_PLANS, TIME_SLOTS, PROGRAM_LABELS } from '@/types'
import { formatDate } from '@/lib/utils'

export default function EditStudentPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const studentId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resending, setResending] = useState(false)
  const [suspending, setSuspending] = useState(false)
  const [resetingPw, setResetingPw] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [groups, setGroups] = useState<any[]>([])

  const [profile, setProfile] = useState<any>(null)
  const [student, setStudent] = useState<any>(null)

  // Editable fields
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    country: '',
    age_group: '',
    program: '',
    group_id: '',
    day_preference: '',
    preferred_time: '',
    payment_plan: '',
    status: '',
  })

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  useEffect(() => {
    const load = async () => {
      const [{ data: prof }, { data: stu }, { data: grps }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', studentId).single(),
        supabase.from('students').select('*, group:groups(*)').eq('id', studentId).single(),
        supabase.from('groups').select('*').eq('is_active', true).order('name'),
      ])

      if (!prof || !stu) { setNotFound(true); setLoading(false); return }

      setProfile(prof)
      setStudent(stu)
      setGroups(grps || [])
      setForm({
        full_name: prof.full_name || '',
        phone: prof.phone || '',
        country: prof.country || '',
        age_group: prof.age_group || '',
        program: stu.program || '',
        group_id: stu.group_id || '',
        day_preference: stu.day_preference || '',
        preferred_time: stu.preferred_time || '',
        payment_plan: stu.payment_plan || '',
        status: stu.status || 'active',
      })
      setLoading(false)
    }
    load()
  }, [studentId])

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const filteredGroups = groups.filter(g =>
    (!form.program || g.program === form.program) &&
    (!form.day_preference || g.day_preference === form.day_preference)
  )

  // Save profile + student changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const [{ error: profErr }, { error: stuErr }] = await Promise.all([
        supabase.from('profiles').update({
          full_name: form.full_name,
          phone: form.phone,
          country: form.country,
          age_group: form.age_group || null,
        }).eq('id', studentId),
        supabase.from('students').update({
          program: form.program,
          group_id: form.group_id || null,
          day_preference: form.day_preference,
          preferred_time: form.preferred_time,
          payment_plan: form.payment_plan || null,
        }).eq('id', studentId),
      ])
      if (profErr) throw profErr
      if (stuErr) throw stuErr
      showToast('Student details updated successfully.')
    } catch (e: any) {
      showToast(e.message || 'Failed to save changes.', 'error')
    } finally {
      setSaving(false)
    }
  }

  // Reset password via API
  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      showToast('Password must be at least 6 characters.', 'error')
      return
    }
    setResetingPw(true)
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: studentId, password: newPassword }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)
      showToast('Password updated successfully.')
      setNewPassword('')
    } catch (e: any) {
      showToast(e.message || 'Failed to reset password.', 'error')
    } finally {
      setResetingPw(false)
    }
  }

  // Resend credentials via WhatsApp
  const handleResend = () => {
    if (!newPassword) {
      showToast('Set a new password above first, then resend.', 'error')
      return
    }
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://quran-academy-online.netlify.app'
    const text = `Assalamu Alaykum ${form.full_name}! 🌙\n\nHere are your updated Dārul Furqōn login credentials:\n\n📧 Email: ${profile.email}\n🔑 Password: ${newPassword}\n🔗 Login: ${siteUrl}/login\n\nJazakAllahu Khayran! 📖`
    const phone = (profile.phone || form.phone || '').replace(/\D/g, '')
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank')
  }

  // Suspend / re-activate — also bans user in Supabase Auth
  const handleToggleSuspend = async () => {
    const isSuspended = form.status === 'suspended'
    const action = isSuspended ? 'Re-activate' : 'Suspend'
    if (!confirm(`${action} this student? ${!isSuspended ? 'They will not be able to log in.' : ''}`)) return

    setSuspending(true)
    try {
      const newStatus = isSuspended ? 'active' : 'suspended'

      // Update student status in DB
      const { error: stuErr } = await supabase
        .from('students')
        .update({ status: newStatus })
        .eq('id', studentId)
      if (stuErr) throw stuErr

      // Ban/unban in Supabase Auth via API
      const res = await fetch('/api/admin/toggle-ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: studentId, ban: !isSuspended }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)

      setForm(prev => ({ ...prev, status: newStatus }))
      showToast(`Student ${newStatus === 'suspended' ? 'suspended — login blocked.' : 're-activated — login restored.'}`)
    } catch (e: any) {
      showToast(e.message || 'Failed to update status.', 'error')
    } finally {
      setSuspending(false)
    }
  }

  // ── States ──────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
    </div>
  )

  if (notFound) return (
    <div className="max-w-lg">
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <p className="text-gray-500 mb-4">Student not found.</p>
        <Link href="/admin/students" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Students
        </Link>
      </div>
    </div>
  )

  const isSuspended = form.status === 'suspended'

  return (
    <div className="max-w-2xl space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-lg text-sm font-medium flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : null}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/students" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-emerald-900">Edit Student</h1>
          <p className="text-gray-500 text-sm">{profile.email}</p>
        </div>
        {isSuspended && (
          <span className="text-xs bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-full font-semibold">
            Suspended
          </span>
        )}
      </div>

      {/* Student info + editable form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <h3 className="font-semibold text-emerald-800 pb-3 border-b flex items-center gap-2">
          <User className="w-4 h-4" /> Personal Details
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Full Name</label>
            <input className="input-field" value={form.full_name} onChange={e => update('full_name', e.target.value)} />
          </div>
          <div>
            <label className="label-field">Email (cannot change)</label>
            <input className="input-field bg-gray-50 text-gray-400 cursor-not-allowed" value={profile.email} readOnly />
          </div>
          <div>
            <label className="label-field">Phone / WhatsApp</label>
            <input className="input-field" value={form.phone} onChange={e => update('phone', e.target.value)} />
          </div>
          <div>
            <label className="label-field">Country</label>
            <input className="input-field" value={form.country} onChange={e => update('country', e.target.value)} />
          </div>
          <div>
            <label className="label-field">Age Group</label>
            <select className="input-field" value={form.age_group} onChange={e => update('age_group', e.target.value)}>
              <option value="">Select...</option>
              <option value="child">Child</option>
              <option value="teen">Teen</option>
              <option value="adult">Adult</option>
            </select>
          </div>
        </div>

        <h3 className="font-semibold text-emerald-800 pb-3 border-b pt-2 flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Program & Schedule
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Program</label>
            <select className="input-field" value={form.program} onChange={e => update('program', e.target.value)}>
              <option value="">Select...</option>
              {PROGRAMS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">Day Preference</label>
            <select className="input-field" value={form.day_preference} onChange={e => update('day_preference', e.target.value)}>
              <option value="">Select...</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
            </select>
          </div>
          <div>
            <label className="label-field">Preferred Time (WAT)</label>
            <select className="input-field" value={form.preferred_time} onChange={e => update('preferred_time', e.target.value)}>
              <option value="">Select time...</option>
              {TIME_SLOTS.map(t => <option key={t} value={t}>{t} WAT</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">Group</label>
            <select className="input-field" value={form.group_id} onChange={e => update('group_id', e.target.value)}>
              <option value="">No group</option>
              {(filteredGroups.length > 0 ? filteredGroups : groups).map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Payment Plan</label>
            <select className="input-field" value={form.payment_plan} onChange={e => update('payment_plan', e.target.value)}>
              <option value="">Select...</option>
              {PAYMENT_PLANS.map(p => <option key={p.id} value={p.id}>{p.label} — {p.amount}</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">Enrolled On</label>
            <input className="input-field bg-gray-50 text-gray-400 cursor-not-allowed" value={student?.enrollment_date ? formatDate(student.enrollment_date) : '—'} readOnly />
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Password reset + resend credentials */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h3 className="font-semibold text-emerald-800 pb-3 border-b flex items-center gap-2">
          <Key className="w-4 h-4" /> Password & Login Credentials
        </h3>

        <div>
          <label className="label-field">Set New Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field pr-12 font-mono tracking-wide"
              placeholder="Enter new password..."
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Minimum 6 characters. Student should change this after logging in.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleResetPassword}
            disabled={resetingPw || !newPassword}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {resetingPw ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
            {resetingPw ? 'Updating...' : 'Update Password'}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending || !newPassword}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-emerald-200 text-emerald-700 font-semibold hover:bg-emerald-50 transition-all text-sm disabled:opacity-50"
          >
            <MessageCircle className="w-4 h-4" />
            Resend via WhatsApp
          </button>
        </div>

        <div className="bg-gold-50 border border-gold-100 rounded-xl p-3 text-xs text-gold-700">
          💡 Set the new password first, then click <strong>Resend via WhatsApp</strong> to send the updated credentials to the student.
        </div>
      </div>

      {/* Suspend / Re-activate */}
      <div className={`rounded-2xl border p-6 space-y-3 ${isSuspended ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
        <h3 className={`font-semibold pb-3 border-b flex items-center gap-2 ${isSuspended ? 'text-red-700 border-red-200' : 'text-gray-800 border-gray-100'}`}>
          {isSuspended ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
          Account Status
        </h3>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-medium text-sm text-gray-800">
              Current status: <span className={`font-bold capitalize ${isSuspended ? 'text-red-600' : 'text-emerald-600'}`}>{form.status}</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {isSuspended
                ? 'This student is blocked from logging in. Re-activate to restore access.'
                : 'This student can log in normally. Suspending will immediately block their access.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleSuspend}
            disabled={suspending}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
              isSuspended
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-red-500 text-white hover:bg-red-600'
            } disabled:opacity-50`}
          >
            {suspending
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : isSuspended
                ? <UserCheck className="w-4 h-4" />
                : <UserX className="w-4 h-4" />
            }
            {suspending ? 'Processing...' : isSuspended ? 'Re-activate Student' : 'Suspend Student'}
          </button>
        </div>
      </div>
    </div>
  )
}