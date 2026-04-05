import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { userId, ban } = await request.json()

    if (!userId || typeof ban !== 'boolean') {
      return NextResponse.json({ error: 'Missing userId or ban flag' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // ban_duration: 'none' restores access, a duration string bans them
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      ban_duration: ban ? '876000h' : 'none', // 876000h ≈ 100 years = effectively permanent
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Toggle ban error:', error)
    return NextResponse.json({ error: error.message || 'Failed to update ban status' }, { status: 500 })
  }
}