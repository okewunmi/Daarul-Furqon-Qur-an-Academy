'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Users, Edit2, UserX } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PROGRAM_LABELS, type ProgramType } from '@/types'
import { formatDate } from '@/lib/utils'

interface StudentRow {
  id: string
  program: ProgramType
  status: string
  day_preference: string
  preferred_time: string
  enrollment_date: string
  profile: { full_name: string; email: string; phone: string; country: string } | null
  group: { name: string } | null
}

export default function AdminStudentsPage() {
  const supabase = createClient()
  const [students, setStudents] = useState<StudentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterProgram, setFilterProgram] = useState('')

  useEffect(() => { load() }, [])

  const load = async () => {
    const { data } = await supabase
      .from('students')
      .select('*, profile:profiles(full_name, email, phone, country), group:groups(name)')
      .order('created_at', { ascending: false })
    setStudents(data as any || [])
    setLoading(false)
  }

  const handleSuspend = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
    if (!confirm(`${newStatus === 'suspended' ? 'Suspend' : 'Re-activate'} this student?`)) return
    await supabase.from('students').update({ status: newStatus }).eq('id', id)
    load()
  }

  const filtered = students.filter(s => {
    const matchSearch = !search || [
      s.profile?.full_name, s.profile?.email, s.profile?.phone, s.profile?.country
    ].some(v => v?.toLowerCase().includes(search.toLowerCase()))
    const matchProgram = !filterProgram || s.program === filterProgram
    return matchSearch && matchProgram
  })

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    suspended: 'bg-red-100 text-red-600',
    completed: 'bg-blue-100 text-blue-700',
    pending: 'bg-gold-100 text-gold-700',
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-emerald-900">Students</h1>
          <p className="text-gray-500 mt-1">Manage all enrolled students and their details.</p>
        </div>
        <Link href="/admin/students/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Student
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="input-field pl-10"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input-field w-auto"
          value={filterProgram}
          onChange={e => setFilterProgram(e.target.value)}
        >
          <option value="">All Programs</option>
          {Object.entries(PROGRAM_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* Stats bar */}
      <div className="flex gap-4 flex-wrap text-sm text-gray-500">
        <span><strong className="text-emerald-700">{filtered.length}</strong> students shown</span>
        <span><strong className="text-emerald-700">{students.filter(s => s.status === 'active').length}</strong> active</span>
        <span><strong className="text-red-600">{students.filter(s => s.status === 'suspended').length}</strong> suspended</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No students found.</p>
          <Link href="/admin/students/new" className="btn-primary inline-flex items-center gap-2 mt-4">
            <Plus className="w-4 h-4" /> Add First Student
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Student</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Program</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Group</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Schedule</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Enrolled</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {student.profile?.full_name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 text-sm">{student.profile?.full_name || '—'}</div>
                          <div className="text-gray-400 text-xs">{student.profile?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600 capitalize">{PROGRAM_LABELS[student.program]?.split(' ')[0]}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600">{student.group?.name || <span className="text-gray-400 italic">Unassigned</span>}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm text-gray-600 capitalize">{student.day_preference}</div>
                      <div className="text-xs text-gray-400">{student.preferred_time} WAT</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColors[student.status] || 'bg-gray-100 text-gray-600'}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {formatDate(student.enrollment_date)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/students/${student.id}/edit`} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleSuspend(student.id, student.status)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
