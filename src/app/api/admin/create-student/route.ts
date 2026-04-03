import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      full_name, email, phone, country, age_group,
      program, group_id, day_preference, preferred_time,
      payment_plan, temp_password
    } = body

    if (!email || !temp_password || !full_name || !program) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: temp_password,
      email_confirm: true,
      user_metadata: {
        full_name,
        role: 'student',
      },
    })

    if (authError) throw authError

    const userId = authData.user.id

    // Update profile (auto-created by trigger)
    await supabase.from('profiles').update({
      full_name,
      phone,
      country,
      age_group: age_group || null,
      role: 'student',
    }).eq('id', userId)

    // Create student record
    const { error: studentError } = await supabase.from('students').insert({
      id: userId,
      program,
      group_id: group_id || null,
      day_preference,
      preferred_time,
      payment_plan: payment_plan || null,
      status: 'active',
      enrollment_date: new Date().toISOString().split('T')[0],
      cycle_start_date: new Date().toISOString().split('T')[0],
    })

    if (studentError) throw studentError

    return NextResponse.json({ success: true, userId })
  } catch (error: any) {
    console.error('Create student error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
