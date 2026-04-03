'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, ArrowRight, Loader2, MessageCircle } from 'lucide-react'
import { PROGRAMS, PAYMENT_PLANS, TIME_SLOTS, type ProgramType, type PaymentPlan, type DayPreference, type AgeGroup } from '@/types'
import { getWhatsAppLink, getPaymentWhatsAppMessage, ADMIN_WHATSAPP } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const WEEKENDS = ['Saturday', 'Sunday']

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    country: '',
    age_group: '' as AgeGroup,
    program: (searchParams.get('program') || '') as ProgramType,
    day_preference: '' as DayPreference,
    preferred_time: '',
    payment_plan: (searchParams.get('plan') || '') as PaymentPlan,
  })

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const canProceedStep1 = form.full_name && form.email && form.phone && form.country && form.age_group
  const canProceedStep2 = form.program && form.day_preference && form.preferred_time
  const canProceedStep3 = form.payment_plan

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const { error: err } = await supabase.from('registrations').insert({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        country: form.country,
        age_group: form.age_group,
        program: form.program,
        day_preference: form.day_preference,
        preferred_time: form.preferred_time,
        payment_plan: form.payment_plan,
        whatsapp_sent: false,
        status: 'pending',
      })
      if (err) throw err
      setSubmitted(true)
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectedProgram = PROGRAMS.find(p => p.id === form.program)
  const selectedPlan = PAYMENT_PLANS.find(p => p.id === form.payment_plan)
  const availableDays = form.day_preference === 'weekdays' ? WEEKDAYS : form.day_preference === 'weekends' ? WEEKENDS : []

  if (submitted) {
    const waMessage = getPaymentWhatsAppMessage(form.full_name, selectedProgram?.name || form.program, selectedPlan?.label || form.payment_plan)
    const waLink = getWhatsAppLink(ADMIN_WHATSAPP, waMessage)

    return (
      <div className="min-h-screen geometric-bg flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="font-display text-3xl font-bold text-emerald-900 mb-3">
            Registration Received!
          </h2>
          <p className="text-gray-600 mb-2">
            JazakAllahu Khayran, <strong>{form.full_name}</strong>!
          </p>
          <p className="text-gray-600 text-sm mb-8">
            Your application has been submitted. The next step is to send your proof of payment
            to our admin on WhatsApp. Your login will be created within 24 hours.
          </p>

          <div className="bg-gold-50 border border-gold-200 rounded-2xl p-4 mb-6 text-left">
            <p className="text-xs font-semibold text-gold-700 uppercase tracking-wide mb-2">Your Registration Summary</p>
            <div className="space-y-1 text-sm text-gray-700">
              <div className="flex justify-between"><span className="text-gray-500">Program:</span><span className="font-medium">{selectedProgram?.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Schedule:</span><span className="font-medium capitalize">{form.day_preference} at {form.preferred_time} WAT</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Payment Plan:</span><span className="font-medium">{selectedPlan?.label} — {selectedPlan?.amount}</span></div>
            </div>
          </div>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full flex items-center justify-center gap-2 mb-4"
          >
            <MessageCircle className="w-5 h-5" />
            Send Payment Proof on WhatsApp
          </a>
          <p className="text-xs text-gray-400">WhatsApp: {ADMIN_WHATSAPP}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen geometric-bg pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold text-white mb-3">Enroll Today</h1>
          <p className="text-emerald-300">Begin your Qur'anic journey — step by step.</p>
        </div>

        {/* Progress steps */}
        <div className="flex items-center justify-center mb-8 gap-2">
          {['Personal Info', 'Program & Schedule', 'Payment Plan', 'Review'].map((label, i) => {
            const num = i + 1
            const active = step === num
            const done = step > num
            return (
              <div key={num} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  active ? 'bg-gold-400 text-emerald-900' : done ? 'bg-emerald-600 text-white' : 'bg-white/10 text-emerald-400'
                }`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${active ? 'bg-emerald-900 text-gold-400' : done ? 'bg-emerald-500 text-white' : 'bg-white/20 text-emerald-400'}`}>
                    {done ? '✓' : num}
                  </span>
                  <span className="hidden sm:block">{label}</span>
                </div>
                {i < 3 && <div className={`h-px w-4 ${done ? 'bg-emerald-500' : 'bg-white/20'}`} />}
              </div>
            )
          })}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {/* Step 1 — Personal Info */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-display text-2xl font-bold text-emerald-900 mb-6">Personal Information</h2>
              <div>
                <label className="label-field">Full Name *</label>
                <input className="input-field" placeholder="e.g. Fatimah Bello" value={form.full_name} onChange={e => update('full_name', e.target.value)} />
              </div>
              <div>
                <label className="label-field">Email Address *</label>
                <input type="email" className="input-field" placeholder="you@example.com" value={form.email} onChange={e => update('email', e.target.value)} />
              </div>
              <div>
                <label className="label-field">Phone / WhatsApp Number *</label>
                <input className="input-field" placeholder="+234 ..." value={form.phone} onChange={e => update('phone', e.target.value)} />
              </div>
              <div>
                <label className="label-field">Country / Location *</label>
                <input className="input-field" placeholder="e.g. Nigeria, UK, USA" value={form.country} onChange={e => update('country', e.target.value)} />
              </div>
              <div>
                <label className="label-field">Age Group *</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['child', 'teen', 'adult'] as AgeGroup[]).map(ag => (
                    <button
                      key={ag}
                      type="button"
                      onClick={() => update('age_group', ag)}
                      className={`py-3 rounded-xl border-2 font-medium text-sm capitalize transition-all ${
                        form.age_group === ag
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 text-gray-600 hover:border-emerald-300'
                      }`}
                    >
                      {ag === 'child' ? '👦 Child' : ag === 'teen' ? '🧑 Teen' : '🧑‍💼 Adult'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Program & Schedule */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold text-emerald-900 mb-6">Program & Schedule</h2>

              <div>
                <label className="label-field">Choose Your Program *</label>
                <div className="space-y-3">
                  {PROGRAMS.map(prog => (
                    <button
                      key={prog.id}
                      type="button"
                      onClick={() => update('program', prog.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        form.program === prog.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{prog.icon}</span>
                        <div>
                          <div className="font-semibold text-emerald-900 text-sm">{prog.name}</div>
                          <div className="text-gray-500 text-xs">{prog.level} — {prog.fullAcronym}</div>
                        </div>
                        {form.program === prog.id && <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-auto" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label-field">Preferred Class Days *</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['weekdays', 'weekends'] as DayPreference[]).map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => update('day_preference', d)}
                      className={`py-4 rounded-xl border-2 font-medium text-sm capitalize transition-all ${
                        form.day_preference === d
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 text-gray-600 hover:border-emerald-300'
                      }`}
                    >
                      {d === 'weekdays' ? '📅 Weekdays (Mon–Fri)' : '🌤 Weekends (Sat–Sun)'}
                      <div className="text-xs text-gray-400 mt-0.5 font-normal">4 classes per week</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label-field">Preferred Start Time (WAT GMT+1) *</label>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => update('preferred_time', slot)}
                      className={`py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                        form.preferred_time === slot
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 text-gray-600 hover:border-emerald-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Payment Plan */}
          {step === 3 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-emerald-900 mb-6">Choose Your Payment Plan</h2>
              <div className="space-y-4">
                {PAYMENT_PLANS.map(plan => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => update('payment_plan', plan.id)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                      form.payment_plan === plan.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-emerald-900">{plan.label}</div>
                        <div className="text-gray-500 text-sm mt-0.5">{plan.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-2xl font-bold text-emerald-700">{plan.amount}</div>
                        {plan.id === 'full' && <span className="badge-gold text-xs">Best Value</span>}
                        {form.payment_plan === plan.id && <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-auto mt-1" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-800">
                💡 After registering, you'll be directed to send your payment proof to our admin on WhatsApp. Your account will be created within 24 hours.
              </div>
            </div>
          )}

          {/* Step 4 — Review */}
          {step === 4 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-emerald-900 mb-6">Review Your Registration</h2>
              <div className="space-y-3 mb-6">
                {[
                  { label: 'Full Name', value: form.full_name },
                  { label: 'Email', value: form.email },
                  { label: 'Phone', value: form.phone },
                  { label: 'Country', value: form.country },
                  { label: 'Age Group', value: form.age_group },
                  { label: 'Program', value: selectedProgram?.name },
                  { label: 'Schedule', value: `${form.day_preference === 'weekdays' ? 'Weekdays (Mon–Fri)' : 'Weekends (Sat–Sun)'} at ${form.preferred_time} WAT` },
                  { label: 'Payment Plan', value: `${selectedPlan?.label} — ${selectedPlan?.amount}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">{label}</span>
                    <span className="text-gray-800 text-sm font-medium capitalize">{value}</span>
                  </div>
                ))}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm mb-4">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn-outline flex-1"
              >
                Back
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && !canProceedStep1) ||
                  (step === 2 && !canProceedStep2) ||
                  (step === 3 && !canProceedStep3)
                }
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Submitting...' : 'Submit Registration'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
