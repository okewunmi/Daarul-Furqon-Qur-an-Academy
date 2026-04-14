'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, ArrowLeft, CheckCircle2, User, BookOpen, Calendar, Clock, CreditCard, Phone, Mail, Globe, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PROGRAM_LABELS, PAYMENT_PLANS, type ProgramType, type PaymentPlan, type DayPreference, type AgeGroup } from '@/types'
import Link from 'next/link'
import type { Registration } from '@/types'

export default function NewStudentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const registrationId = searchParams.get('from')

  const [groups, setGroups] = useState<any[]>([])
  const [registration, setRegistration] = useState<Registration | null>(null)
  const [loadingReg, setLoadingReg] = useState(!!registrationId)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [createdCreds, setCreatedCreds] = useState<{ email: string; password: string } | null>(null)

  // Admin-only inputs
  const [groupId, setGroupId] = useState('')
  const [tempPassword, setTempPassword] = useState('')

  useEffect(() => {
    const init = async () => {
      // Load groups
      const { data: groupData } = await supabase
        .from('groups')
        .select('*')
        .eq('is_active', true)
        .order('name')
      setGroups(groupData || [])

      // Load registration if coming from registrations page
      if (registrationId) {
        const { data: reg } = await supabase
          .from('registrations')
          .select('*')
          .eq('id', registrationId)
          .single()
        setRegistration(reg)
        setLoadingReg(false)
      }
    }
    init()
  }, [registrationId])

  // Groups filtered by student's program + day preference
  const filteredGroups = groups.filter(g =>
    (!registration?.program || g.program === registration.program) &&
    (!registration?.day_preference || g.day_preference === registration.day_preference)
  )

  const selectedPlan = PAYMENT_PLANS.find(p => p.id === registration?.payment_plan)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!registration) return
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/admin/create-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: registration.full_name,
          email: registration.email,
          phone: registration.phone,
          country: registration.country,
          age_group: registration.age_group,
          program: registration.program,
          group_id: groupId || null,
          day_preference: registration.day_preference,
          preferred_time: registration.preferred_time,
          payment_plan: registration.payment_plan,
          temp_password: tempPassword,
        }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Failed to create student')

      // Mark registration as approved
      await supabase
        .from('registrations')
        .update({ status: 'approved' })
        .eq('id', registrationId)

      setCreatedCreds({ email: registration.email, password: tempPassword })
      setSuccess(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success screen ──────────────────────────────────────────
  if (success && createdCreds && registration) {
    const siteUrl =  'https://quran-academy-online.netlify.app'
    const waText = `Assalamu Alaykum ${registration.full_name}! 🌙\n\nYour Dārul Furqōn Academy student account has been created.\n\n📧 Login Email: ${createdCreds.email}\n🔑 Password: ${createdCreds.password}\n🔗 Login here: ${siteUrl}/login\n\nPlease change your password after your first login.\n\nJazakAllahu Khayran! 📖`

    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-emerald-900 mb-1">Account Created!</h2>
          <p className="text-gray-500 text-sm mb-6">
            {registration.full_name}'s account is ready. Send them the credentials below.
          </p>

          <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 text-left mb-6">
            <p className="text-xs font-semibold text-gold-700 uppercase tracking-wide mb-3">Login Credentials</p>
            <div className="space-y-2.5">
              {[
                { label: 'Email', value: createdCreds.email },
                { label: 'Password', value: createdCreds.password },
                { label: 'Login URL', value: `${siteUrl}/login` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{label}:</span>
                  <span className="font-mono font-bold text-gray-800 text-right ml-4 break-all">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <a
            href={`https://wa.me/${registration.phone.replace(/\D/g, '')}?text=${encodeURIComponent(waText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full flex items-center justify-center gap-2 mb-3"
          >
            📱 Send Credentials via WhatsApp
          </a>
          <Link href="/admin/registrations" className="btn-outline w-full block text-center">
            Back to Registrations
          </Link>
        </div>
      </div>
    )
  }

  // ── Loading registration ────────────────────────────────────
  if (loadingReg) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    )
  }

  // ── No registration found ───────────────────────────────────
  if (registrationId && !registration) {
    return (
      <div className="max-w-lg">
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-500 mb-4">Registration record not found.</p>
          <Link href="/admin/registrations" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Registrations
          </Link>
        </div>
      </div>
    )
  }

  // ── Main form ───────────────────────────────────────────────
  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={registrationId ? `/admin/registrations/${registrationId}` : '/admin/students'}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-emerald-900">Create Student Account</h1>
          <p className="text-gray-500 text-sm">
            {registration
              ? `Setting up account for ${registration.full_name}`
              : 'Set up login credentials for a new student.'}
          </p>
        </div>
      </div>

      {registration && (
        <>
          {/* Read-only student info from registration */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Card header */}
            <div className="geometric-bg px-6 py-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gold-400/20 border border-gold-400/30 flex items-center justify-center text-gold-400 font-display font-bold text-xl">
                {registration.full_name.charAt(0)}
              </div>
              <div>
                <p className="text-white font-semibold">{registration.full_name}</p>
                <p className="text-emerald-300 text-xs">From registration — read only</p>
              </div>
              <span className="ml-auto badge-gold text-xs">Pre-filled</span>
            </div>

            {/* Info grid */}
            <div className="p-6 grid sm:grid-cols-2 gap-4">
              {[
                { icon: Mail, label: 'Email', value: registration.email },
                { icon: Phone, label: 'Phone', value: registration.phone },
                { icon: Globe, label: 'Country', value: registration.country },
                { icon: User, label: 'Age Group', value: registration.age_group, capitalize: true },
                { icon: BookOpen, label: 'Program', value: PROGRAM_LABELS[registration.program] || registration.program },
                { icon: Calendar, label: 'Days', value: registration.day_preference === 'weekdays' ? 'Weekdays (Mon–Fri)' : 'Weekends (Sat–Sun)' },
                { icon: Clock, label: 'Preferred Time', value: `${registration.preferred_time} WAT` },
                { icon: CreditCard, label: 'Payment Plan', value: `${selectedPlan?.label || registration.payment_plan} — ${selectedPlan?.amount || ''}` },
              ].map(({ icon: Icon, label, value, capitalize }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 leading-none mb-0.5">{label}</p>
                    <p className={`text-gray-800 text-sm font-medium truncate ${capitalize ? 'capitalize' : ''}`}>
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin inputs — group + password only */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Lock className="w-4 h-4 text-emerald-600" />
              <h3 className="font-semibold text-emerald-800">Admin Setup</h3>
            </div>

            {/* Group assignment */}
            <div>
              <label className="label-field">Assign to Group</label>
              <select
                className="input-field"
                value={groupId}
                onChange={e => setGroupId(e.target.value)}
              >
                <option value="">Select a group...</option>
                {filteredGroups.length > 0
                  ? filteredGroups.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))
                  : groups.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))
                }
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Showing groups matching <strong className="capitalize">{registration.program}</strong> + <strong className="capitalize">{registration.day_preference}</strong>.
                You can still pick any group if needed.
              </p>
            </div>

            {/* Temporary password */}
            <div>
              <label className="label-field">Temporary Password *</label>
              <input
                type="text"
                className="input-field font-mono tracking-wide"
                placeholder="e.g. Quran@2024"
                value={tempPassword}
                onChange={e => setTempPassword(e.target.value)}
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Student will use this to log in. Advise them to change it after first login.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !tempPassword}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? 'Creating Account...' : `Create Account for ${registration.full_name.split(' ')[0]}`}
            </button>
          </form>
        </>
      )}
    </div>
  )
}