'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, CheckCircle2, XCircle, MessageCircle,
  User, BookOpen, Calendar, Clock, CreditCard,
  Globe, Phone, Mail, Loader2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate, getWhatsAppLink } from '@/lib/utils'
import { PROGRAM_LABELS, PAYMENT_PLANS, type Registration } from '@/types'

export default function RegistrationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [reg, setReg] = useState<Registration | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('id', params.id as string)
        .single()

      if (error || !data) {
        setNotFound(true)
      } else {
        setReg(data)
      }
      setLoading(false)
    }
    load()
  }, [params.id])

  const updateStatus = async (status: 'approved' | 'rejected') => {
    if (!reg) return
    const msg = status === 'rejected' ? 'Reject this registration?' : 'Approve this registration?'
    if (!confirm(msg)) return
    setUpdating(true)
    await supabase.from('registrations').update({ status }).eq('id', reg.id)
    setReg(prev => prev ? { ...prev, status } : prev)
    setUpdating(false)
  }

  const selectedPlan = PAYMENT_PLANS.find(p => p.id === reg?.payment_plan)

  const waMessage = reg
    ? `Assalamu Alaykum ${reg.full_name}! We have received your registration for the ${PROGRAM_LABELS[reg.program] || reg.program} program at Dārul Furqōn Academy. Please confirm your payment so we can activate your account. JazakAllahu Khayran.`
    : ''

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound || !reg) {
    return (
      <div className="max-w-2xl">
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="font-display text-2xl font-bold text-gray-800 mb-2">Registration Not Found</h2>
          <p className="text-gray-500 mb-6">
            The registration with ID <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">{params.id}</code> does not exist.
          </p>
          <Link href="/admin/registrations" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Registrations
          </Link>
        </div>
      </div>
    )
  }

  const statusConfig = {
    pending: { label: 'Pending Review', color: 'bg-gold-100 text-gold-700 border-gold-200' },
    approved: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-600 border-red-200' },
  }
  const status = statusConfig[reg.status as keyof typeof statusConfig] || statusConfig.pending

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/registrations" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-emerald-900">Registration Detail</h1>
          <p className="text-gray-400 text-xs mt-0.5 font-mono">{reg.id}</p>
        </div>
        <span className={`text-sm px-3 py-1.5 rounded-full font-semibold border capitalize ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Student info card */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="geometric-bg p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gold-400/20 border border-gold-400/30 flex items-center justify-center text-gold-400 font-display font-bold text-2xl">
              {reg.full_name.charAt(0)}
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-white">{reg.full_name}</h2>
              <p className="text-emerald-300 text-sm mt-0.5">Registered {formatDate(reg.created_at)}</p>
            </div>
          </div>
        </div>

        <div className="p-6 grid sm:grid-cols-2 gap-5">
          {[
            { icon: Mail, label: 'Email', value: reg.email },
            { icon: Phone, label: 'Phone / WhatsApp', value: reg.phone },
            { icon: Globe, label: 'Country', value: reg.country },
            { icon: User, label: 'Age Group', value: reg.age_group, capitalize: true },
          ].map(({ icon: Icon, label, value, capitalize }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                <p className={`text-gray-800 font-medium mt-0.5 ${capitalize ? 'capitalize' : ''}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program & schedule */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-emerald-800 mb-4 pb-3 border-b border-gray-100">Program & Schedule</h3>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { icon: BookOpen, label: 'Program', value: PROGRAM_LABELS[reg.program] || reg.program },
            { icon: Calendar, label: 'Preferred Days', value: reg.day_preference === 'weekdays' ? 'Weekdays (Mon–Fri)' : 'Weekends (Sat–Sun)', capitalize: true },
            { icon: Clock, label: 'Preferred Time', value: `${reg.preferred_time} WAT (GMT+1)` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold-50 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-gold-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                <p className="text-gray-800 font-medium mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-emerald-800 mb-4 pb-3 border-b border-gray-100">Payment Plan</h3>
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">{selectedPlan?.label || reg.payment_plan}</p>
            <p className="text-emerald-700 font-bold">{selectedPlan?.amount}</p>
          </div>
          <div className={`ml-auto px-3 py-1.5 rounded-full text-xs font-semibold border ${
            reg.whatsapp_sent
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-gray-50 text-gray-500 border-gray-200'
          }`}>
            {reg.whatsapp_sent ? '✓ Payment proof received' : '⏳ Awaiting payment proof'}
          </div>
        </div>
      </div>

      {/* Admin notes */}
      {reg.notes && (
        <div className="bg-gold-50 border border-gold-200 rounded-2xl p-4">
          <p className="text-xs font-semibold text-gold-700 uppercase tracking-wide mb-1">Admin Notes</p>
          <p className="text-gray-700 text-sm">{reg.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-emerald-800 mb-4">Actions</h3>
        <div className="flex flex-wrap gap-3">
          {/* Create account — main action */}
          {reg.status !== 'rejected' && (
            <Link
              href={`/admin/students/new?from=${reg.id}&email=${encodeURIComponent(reg.email)}&name=${encodeURIComponent(reg.full_name)}&program=${reg.program}&day=${reg.day_preference}&time=${reg.preferred_time}&phone=${encodeURIComponent(reg.phone)}&plan=${reg.payment_plan}&country=${encodeURIComponent(reg.country)}&age=${reg.age_group}`}
              className="btn-primary flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Create Student Account
            </Link>
          )}

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${reg.phone.replace(/\D/g, '')}?text=${encodeURIComponent(waMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-emerald-200 text-emerald-700 font-semibold hover:bg-emerald-50 transition-all text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Message on WhatsApp
          </a>

          {/* Approve / Reject toggles */}
          {reg.status === 'pending' && (
            <button
              onClick={() => updateStatus('rejected')}
              disabled={updating}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-all text-sm disabled:opacity-50"
            >
              {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              Reject
            </button>
          )}

          {reg.status === 'rejected' && (
            <button
              onClick={() => updateStatus('approved')}
              disabled={updating}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-emerald-200 text-emerald-700 font-semibold hover:bg-emerald-50 transition-all text-sm disabled:opacity-50"
            >
              {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Re-approve
            </button>
          )}
        </div>

        <p className="text-gray-400 text-xs mt-4">
          After creating the student account, their login credentials will be sent to them via WhatsApp automatically.
        </p>
      </div>
    </div>
  )
}