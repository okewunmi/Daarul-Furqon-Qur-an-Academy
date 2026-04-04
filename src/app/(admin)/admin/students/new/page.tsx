// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
// import { createClient } from '@/lib/supabase/client'
// import { PROGRAMS, PAYMENT_PLANS, TIME_SLOTS, type ProgramType, type PaymentPlan, type DayPreference, type AgeGroup } from '@/types'
// import Link from 'next/link'

// export default function NewStudentPage() {
//   const router = useRouter()
//   const supabase = createClient()
//   const [groups, setGroups] = useState<any[]>([])
//   const [loading, setLoading] = useState(false)
//   const [success, setSuccess] = useState(false)
//   const [error, setError] = useState('')
//   const [createdCreds, setCreatedCreds] = useState<{ email: string; password: string } | null>(null)

//   const [form, setForm] = useState({
//     full_name: '',
//     email: '',
//     phone: '',
//     country: '',
//     age_group: '' as AgeGroup,
//     program: '' as ProgramType,
//     group_id: '',
//     day_preference: '' as DayPreference,
//     preferred_time: '',
//     payment_plan: '' as PaymentPlan,
//     temp_password: '',
//   })

//   useEffect(() => {
//     supabase.from('groups').select('*').eq('is_active', true).then(({ data }) => setGroups(data || []))
//   }, [])

//   const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

//   const filteredGroups = groups.filter(g =>
//     (!form.program || g.program === form.program) &&
//     (!form.day_preference || g.day_preference === form.day_preference)
//   )

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError('')

//     try {
//       // Create auth user via API route
//       const res = await fetch('/api/admin/create-student', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(form),
//       })
//       const result = await res.json()
//       if (!res.ok) throw new Error(result.error || 'Failed to create student')

//       setCreatedCreds({ email: form.email, password: form.temp_password })
//       setSuccess(true)
//     } catch (e: any) {
//       setError(e.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (success && createdCreds) {
//     return (
//       <div className="max-w-lg mx-auto">
//         <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
//           <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
//             <CheckCircle2 className="w-8 h-8 text-emerald-600" />
//           </div>
//           <h2 className="font-display text-2xl font-bold text-emerald-900 mb-2">Student Created!</h2>
//           <p className="text-gray-600 text-sm mb-6">Share these credentials with the student via WhatsApp.</p>

//           <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 text-left mb-6">
//             <p className="text-xs font-semibold text-gold-700 uppercase tracking-wide mb-3">Login Credentials</p>
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500">Email:</span>
//                 <span className="font-mono font-bold text-gray-800">{createdCreds.email}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500">Password:</span>
//                 <span className="font-mono font-bold text-gray-800">{createdCreds.password}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500">Login URL:</span>
//                 <span className="font-mono text-emerald-700 text-xs">/login</span>
//               </div>
//             </div>
//           </div>

//           <a
//             href={`https://wa.me/${form.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Assalamu Alaykum ${form.full_name}! Your Daarul Furqon student account has been created.\n\nLogin: ${createdCreds.email}\nPassword: ${createdCreds.password}\n\nVisit: ${process.env.NEXT_PUBLIC_SITE_URL}/login\n\nJazakAllahu Khayran!`)}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="btn-primary w-full flex items-center justify-center gap-2 mb-3"
//           >
//             Send via WhatsApp
//           </a>
//           <Link href="/admin/students" className="btn-outline w-full block text-center">
//             Back to Students
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-2xl space-y-6">
//       <div className="flex items-center gap-3">
//         <Link href="/admin/students" className="p-2 text-gray-400 hover:text-gray-600">
//           <ArrowLeft className="w-5 h-5" />
//         </Link>
//         <div>
//           <h1 className="font-display text-2xl font-bold text-emerald-900">Create Student Account</h1>
//           <p className="text-gray-500 text-sm">Set up login credentials for a new student.</p>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
//         <h3 className="font-semibold text-emerald-800 border-b pb-3">Personal Details</h3>

//         <div className="grid md:grid-cols-2 gap-4">
//           <div>
//             <label className="label-field">Full Name *</label>
//             <input className="input-field" value={form.full_name} onChange={e => update('full_name', e.target.value)} required />
//           </div>
//           <div>
//             <label className="label-field">Email *</label>
//             <input type="email" className="input-field" value={form.email} onChange={e => update('email', e.target.value)} required />
//           </div>
//           <div>
//             <label className="label-field">Phone / WhatsApp *</label>
//             <input className="input-field" value={form.phone} onChange={e => update('phone', e.target.value)} required />
//           </div>
//           <div>
//             <label className="label-field">Country</label>
//             <input className="input-field" value={form.country} onChange={e => update('country', e.target.value)} />
//           </div>
//           <div>
//             <label className="label-field">Age Group</label>
//             <select className="input-field" value={form.age_group} onChange={e => update('age_group', e.target.value)}>
//               <option value="">Select...</option>
//               <option value="child">Child</option>
//               <option value="teen">Teen</option>
//               <option value="adult">Adult</option>
//             </select>
//           </div>
//         </div>

//         <h3 className="font-semibold text-emerald-800 border-b pb-3 pt-2">Program & Group</h3>

//         <div className="grid md:grid-cols-2 gap-4">
//           <div>
//             <label className="label-field">Program *</label>
//             <select className="input-field" value={form.program} onChange={e => update('program', e.target.value)} required>
//               <option value="">Select program...</option>
//               {PROGRAMS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
//             </select>
//           </div>
//           <div>
//             <label className="label-field">Day Preference *</label>
//             <select className="input-field" value={form.day_preference} onChange={e => update('day_preference', e.target.value)} required>
//               <option value="">Select...</option>
//               <option value="weekdays">Weekdays</option>
//               <option value="weekends">Weekends</option>
//             </select>
//           </div>
//           <div>
//             <label className="label-field">Preferred Time (WAT)</label>
//             <select className="input-field" value={form.preferred_time} onChange={e => update('preferred_time', e.target.value)}>
//               <option value="">Select time...</option>
//               {TIME_SLOTS.map(t => <option key={t} value={t}>{t} WAT</option>)}
//             </select>
//           </div>
//           <div>
//             <label className="label-field">Assign to Group</label>
//             <select className="input-field" value={form.group_id} onChange={e => update('group_id', e.target.value)}>
//               <option value="">Select group...</option>
//               {filteredGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
//             </select>
//           </div>
//           <div>
//             <label className="label-field">Payment Plan</label>
//             <select className="input-field" value={form.payment_plan} onChange={e => update('payment_plan', e.target.value)}>
//               <option value="">Select...</option>
//               {PAYMENT_PLANS.map(p => <option key={p.id} value={p.id}>{p.label} — {p.amount}</option>)}
//             </select>
//           </div>
//         </div>

//         <h3 className="font-semibold text-emerald-800 border-b pb-3 pt-2">Account Credentials</h3>

//         <div>
//           <label className="label-field">Temporary Password *</label>
//           <input
//             type="text"
//             className="input-field font-mono"
//             placeholder="e.g. Quran@2024"
//             value={form.temp_password}
//             onChange={e => update('temp_password', e.target.value)}
//             required
//           />
//           <p className="text-xs text-gray-400 mt-1">Student will use this to log in. Advise them to change it.</p>
//         </div>

//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">{error}</div>
//         )}

//         <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
//           {loading && <Loader2 className="w-4 h-4 animate-spin" />}
//           {loading ? 'Creating Account...' : 'Create Student Account'}
//         </button>
//       </form>
//     </div>
//   )
// }



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
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://quran-academy-online.netlify.app'
    const waText = `Assalamu Alaykum ${registration.full_name}! 🌙\n\nYour Daarul Furqon Qur'an Academy student account has been created.\n\n📧 Login Email: ${createdCreds.email}\n🔑 Password: ${createdCreds.password}\n🔗 Login here: ${siteUrl}/login\n\nPlease change your password after your first login.\n\nJazakAllahu Khayran! 📖`

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