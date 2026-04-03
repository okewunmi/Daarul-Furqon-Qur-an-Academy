'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock, CheckCircle2, XCircle, MessageCircle, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate, getWhatsAppLink, ADMIN_WHATSAPP } from '@/lib/utils'
import { PROGRAM_LABELS, type Registration } from '@/types'

export default function AdminRegistrationsPage() {
  const supabase = createClient()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending')

  useEffect(() => { load() }, [filter])

  const load = async () => {
    let query = supabase.from('registrations').select('*').order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('status', filter)
    const { data } = await query
    setRegistrations(data || [])
    setLoading(false)
  }

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    await supabase.from('registrations').update({ status }).eq('id', id)
    load()
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-gold-100 text-gold-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-600',
  }

  const filters = ['pending', 'approved', 'rejected', 'all'] as const

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-emerald-900">Registrations</h1>
        <p className="text-gray-500 mt-1">Review new applications and create student accounts.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === f ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      ) : registrations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No {filter === 'all' ? '' : filter} registrations.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map(reg => (
            <div key={reg.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start gap-4 flex-wrap">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold-300 to-gold-500 flex items-center justify-center text-emerald-900 font-bold shrink-0">
                  {reg.full_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-gray-800">{reg.full_name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColors[reg.status]}`}>
                      {reg.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-1 text-sm text-gray-500">
                    <span>📧 {reg.email}</span>
                    <span>📱 {reg.phone}</span>
                    <span>🌍 {reg.country}</span>
                    <span>👤 {reg.age_group}</span>
                    <span className="capitalize">📚 {PROGRAM_LABELS[reg.program] || reg.program}</span>
                    <span className="capitalize">📅 {reg.day_preference}</span>
                    <span>⏰ {reg.preferred_time} WAT</span>
                    <span className="capitalize">💳 {reg.payment_plan}</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">Registered {formatDate(reg.created_at)}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  {reg.status === 'pending' && (
                    <>
                      <Link
                        href={`/admin/students/new?from=${reg.id}&email=${reg.email}&name=${encodeURIComponent(reg.full_name)}&program=${reg.program}&day=${reg.day_preference}&time=${reg.preferred_time}&phone=${reg.phone}&plan=${reg.payment_plan}`}
                        className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 text-white px-3 py-2 rounded-xl hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Create Account
                      </Link>
                      <button
                        onClick={() => updateStatus(reg.id, 'rejected')}
                        className="flex items-center gap-1.5 text-xs font-semibold bg-red-50 text-red-600 px-3 py-2 rounded-xl hover:bg-red-100"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </>
                  )}
                  <a
                    href={`https://wa.me/${reg.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Assalamu Alaykum ${reg.full_name}! We've received your registration for the ${PROGRAM_LABELS[reg.program] || reg.program} program at Daarul Furqon Qur'an Academy.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 border border-emerald-200 px-3 py-2 rounded-xl hover:bg-emerald-50"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
