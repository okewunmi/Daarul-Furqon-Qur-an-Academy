'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PROGRAMS, PAYMENT_PLANS, TIME_SLOTS, type ProgramType, type PaymentPlan, type DayPreference, type AgeGroup } from '@/types'
import Link from 'next/link'

export default function NewStudentPage() {
  const router = useRouter()
  const supabase = createClient()
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [createdCreds, setCreatedCreds] = useState<{ email: string; password: string } | null>(null)

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    country: '',
    age_group: '' as AgeGroup,
    program: '' as ProgramType,
    group_id: '',
    day_preference: '' as DayPreference,
    preferred_time: '',
    payment_plan: '' as PaymentPlan,
    temp_password: '',
  })

  useEffect(() => {
    supabase.from('groups').select('*').eq('is_active', true).then(({ data }) => setGroups(data || []))
  }, [])

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const filteredGroups = groups.filter(g =>
    (!form.program || g.program === form.program) &&
    (!form.day_preference || g.day_preference === form.day_preference)
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Create auth user via API route
      const res = await fetch('/api/admin/create-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Failed to create student')

      setCreatedCreds({ email: form.email, password: form.temp_password })
      setSuccess(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (success && createdCreds) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-emerald-900 mb-2">Student Created!</h2>
          <p className="text-gray-600 text-sm mb-6">Share these credentials with the student via WhatsApp.</p>

          <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 text-left mb-6">
            <p className="text-xs font-semibold text-gold-700 uppercase tracking-wide mb-3">Login Credentials</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Email:</span>
                <span className="font-mono font-bold text-gray-800">{createdCreds.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Password:</span>
                <span className="font-mono font-bold text-gray-800">{createdCreds.password}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Login URL:</span>
                <span className="font-mono text-emerald-700 text-xs">/login</span>
              </div>
            </div>
          </div>

          <a
            href={`https://wa.me/${form.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Assalamu Alaykum ${form.full_name}! Your Daarul Furqon student account has been created.\n\nLogin: ${createdCreds.email}\nPassword: ${createdCreds.password}\n\nVisit: ${process.env.NEXT_PUBLIC_SITE_URL}/login\n\nJazakAllahu Khayran!`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full flex items-center justify-center gap-2 mb-3"
          >
            Send via WhatsApp
          </a>
          <Link href="/admin/students" className="btn-outline w-full block text-center">
            Back to Students
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/students" className="p-2 text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-emerald-900">Create Student Account</h1>
          <p className="text-gray-500 text-sm">Set up login credentials for a new student.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <h3 className="font-semibold text-emerald-800 border-b pb-3">Personal Details</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Full Name *</label>
            <input className="input-field" value={form.full_name} onChange={e => update('full_name', e.target.value)} required />
          </div>
          <div>
            <label className="label-field">Email *</label>
            <input type="email" className="input-field" value={form.email} onChange={e => update('email', e.target.value)} required />
          </div>
          <div>
            <label className="label-field">Phone / WhatsApp *</label>
            <input className="input-field" value={form.phone} onChange={e => update('phone', e.target.value)} required />
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

        <h3 className="font-semibold text-emerald-800 border-b pb-3 pt-2">Program & Group</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Program *</label>
            <select className="input-field" value={form.program} onChange={e => update('program', e.target.value)} required>
              <option value="">Select program...</option>
              {PROGRAMS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">Day Preference *</label>
            <select className="input-field" value={form.day_preference} onChange={e => update('day_preference', e.target.value)} required>
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
            <label className="label-field">Assign to Group</label>
            <select className="input-field" value={form.group_id} onChange={e => update('group_id', e.target.value)}>
              <option value="">Select group...</option>
              {filteredGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">Payment Plan</label>
            <select className="input-field" value={form.payment_plan} onChange={e => update('payment_plan', e.target.value)}>
              <option value="">Select...</option>
              {PAYMENT_PLANS.map(p => <option key={p.id} value={p.id}>{p.label} — {p.amount}</option>)}
            </select>
          </div>
        </div>

        <h3 className="font-semibold text-emerald-800 border-b pb-3 pt-2">Account Credentials</h3>

        <div>
          <label className="label-field">Temporary Password *</label>
          <input
            type="text"
            className="input-field font-mono"
            placeholder="e.g. Quran@2024"
            value={form.temp_password}
            onChange={e => update('temp_password', e.target.value)}
            required
          />
          <p className="text-xs text-gray-400 mt-1">Student will use this to log in. Advise them to change it.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">{error}</div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Creating Account...' : 'Create Student Account'}
        </button>
      </form>
    </div>
  )
}
