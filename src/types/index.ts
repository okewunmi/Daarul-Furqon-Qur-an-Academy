export type ProgramType = 'foundation' | 'fluency' | 'hifz' | 'understanding' | 'advanced'
export type AgeGroup = 'child' | 'teen' | 'adult'
export type DayPreference = 'weekdays' | 'weekends'
export type PaymentPlan = 'full' | 'installment' | 'monthly'
export type StudentStatus = 'pending' | 'active' | 'suspended' | 'completed'
export type PostStatus = 'draft' | 'published'
export type AnnouncementPriority = 'normal' | 'important' | 'urgent'
export type UserRole = 'student' | 'admin'

export interface Profile {
  id: string
  role: UserRole
  full_name: string
  email: string
  phone?: string
  country?: string
  age_group?: AgeGroup
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Registration {
  id: string
  full_name: string
  email: string
  phone: string
  country: string
  age_group: AgeGroup
  program: ProgramType
  day_preference: DayPreference
  preferred_time: string
  payment_plan: PaymentPlan
  whatsapp_sent: boolean
  status: 'pending' | 'approved' | 'rejected'
  notes?: string
  created_at: string
}

export interface Group {
  id: string
  name: string
  program: ProgramType
  day_preference: DayPreference
  description?: string
  max_students: number
  is_active: boolean
  created_at: string
}

export interface Student {
  id: string
  registration_id?: string
  program: ProgramType
  group_id?: string
  day_preference: DayPreference
  preferred_time: string
  payment_plan: PaymentPlan
  status: StudentStatus
  enrollment_date: string
  cycle_start_date: string
  cycle_end_date?: string
  created_at: string
  updated_at: string
  // joined
  profile?: Profile
  group?: Group
}

export interface Session {
  id: string
  group_id: string
  title: string
  description?: string
  session_date: string
  start_time: string
  end_time: string
  meet_link: string
  recording_link?: string
  is_cancelled: boolean
  cancel_reason?: string
  created_by?: string
  created_at: string
  updated_at: string
  // joined
  group?: Group
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  cover_image?: string
  category: string
  tags: string[]
  status: PostStatus
  author_id?: string
  published_at?: string
  created_at: string
  updated_at: string
  // joined
  author?: Profile
}

export interface Announcement {
  id: string
  title: string
  content: string
  priority: AnnouncementPriority
  target_group?: string
  is_active: boolean
  expires_at?: string
  author_id?: string
  created_at: string
  updated_at: string
  // joined
  group?: Group
}

export interface ProgramInfo {
  id: ProgramType
  name: string
  acronym: string
  fullAcronym: string
  level: string
  description: string
  features: string[]
  outcome: string
  color: string
  icon: string
}

export const PROGRAMS: ProgramInfo[] = [
  {
    id: 'foundation',
    name: 'Foundation Class',
    acronym: 'N.U.R',
    fullAcronym: 'Nurturing Understanding of Recitation',
    level: 'Beginner Level',
    description: 'For learners starting from scratch. Build your Qur\'anic reading foundation step by step.',
    features: ['Arabic letters & sounds (Makharij)', 'Harakat and basic reading rules', 'Introduction to Tajweed', 'Guided recitation practice'],
    outcome: 'Students become confident in reading the Qur\'an independently.',
    color: 'from-gold-400 to-gold-600',
    icon: '📖',
  },
  {
    id: 'fluency',
    name: 'Fluency Class',
    acronym: 'F.A.R.A.H',
    fullAcronym: 'Fluency & Articulation in Recitation Advancement Hub',
    level: 'Intermediate Level',
    description: 'For those who can read but need improvement in rhythm, accuracy, and confidence.',
    features: ['Smooth and accurate recitation', 'Application of Tajweed rules', 'Error correction & repetition drills', 'Listening & imitation techniques'],
    outcome: 'Improved fluency, confidence, and rhythm in recitation.',
    color: 'from-emerald-400 to-emerald-600',
    icon: '🎵',
  },
  {
    id: 'hifz',
    name: 'Hifz Class',
    acronym: 'S.A.B.R',
    fullAcronym: 'Structured Approach to Building Retention',
    level: 'Memorization Track',
    description: 'For committed learners ready to memorize the Qur\'an with structure and support.',
    features: ['Structured memorization schedule', 'Daily & weekly targets', 'Strong revision (Muraja\'ah) system', 'One-on-one supervision'],
    outcome: 'Steady and retained memorization of the Qur\'an.',
    color: 'from-gold-500 to-emerald-600',
    icon: '🧠',
  },
  {
    id: 'understanding',
    name: 'Understanding & Islamic Studies',
    acronym: 'D.E.E.N',
    fullAcronym: 'Developing Enlightenment & Essential Knowledge',
    level: 'Complementary Track',
    description: 'Complement your recitation and memorization with deep Islamic knowledge.',
    features: ['Tawheed, Fiqh, Hadith & Seerah', 'Selected Tafsir sessions', 'Du\'as and daily Islamic practices'],
    outcome: 'Students connect meaningfully with the Qur\'an and their Deen.',
    color: 'from-emerald-500 to-emerald-700',
    icon: '🌙',
  },
  {
    id: 'advanced',
    name: 'Advanced Reflection',
    acronym: 'T.A.D.A.B.B.U.R',
    fullAcronym: 'Thinking And Deep Analysis By Building Understanding & Reflection',
    level: 'Advanced Stage',
    description: 'Go beyond reading and memorizing — internalize the Qur\'an and live by its guidance.',
    features: ['Reflect on Qur\'anic meanings', 'Connect verses to everyday life', 'Build a stronger Islamic identity'],
    outcome: 'Students internalize the Qur\'an, not just read or memorize it.',
    color: 'from-gold-600 to-emerald-800',
    icon: '⭐',
  },
]

export const PAYMENT_PLANS = [
  {
    id: 'full' as PaymentPlan,
    label: 'Full Payment',
    amount: '₦130,000',
    description: 'Pay once, save more',
    savings: 'Best Value',
  },
  {
    id: 'installment' as PaymentPlan,
    label: 'Two Installments',
    amount: '₦145,000',
    description: 'Split into 2 payments',
    savings: 'Flexible',
  },
  {
    id: 'monthly' as PaymentPlan,
    label: 'Monthly Plan',
    amount: '₦170,000',
    description: 'Pay monthly over 4 months',
    savings: 'Easy Start',
  },
]

export const PROGRAM_LABELS: Record<ProgramType, string> = {
  foundation: 'Foundation (N.U.R)',
  fluency: 'Fluency (F.A.R.A.H)',
  hifz: 'Hifz (S.A.B.R)',
  understanding: 'Understanding (D.E.E.N)',
  advanced: 'Advanced (T.A.D.A.B.B.U.R)',
}

export const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00',
]
