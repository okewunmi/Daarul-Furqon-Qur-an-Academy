# Daarul Furqon Qur'an Academy — Next.js Web App

A full-stack Next.js 14 website for an online Islamic institute with student portal, admin panel, and CMS.

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend/DB**: Supabase (Auth + PostgreSQL + RLS)
- **Hosting**: Netlify

---

## Features

### Public Site
- Beautiful landing page with Islamic geometric design (green + gold)
- Programs section: Foundation, Fluency, Hifz, Understanding, Advanced
- Pricing plans (₦130k / ₦145k / ₦170k)
- Multi-step registration form with program, schedule & payment selection
- Blog with CMS (articles, categories, tags)
- FAQ section

### Student Portal (`/dashboard`)
- Personalized dashboard with class info
- Upcoming class schedule with Google Meet links
- Announcement inbox with read tracking
- Profile management

### Admin Panel (`/admin`)
- Overview dashboard with stats
- **Students**: Create login credentials, assign groups, manage status
- **Registrations**: Review applications, create accounts, WhatsApp contact
- **Sessions**: Schedule classes per group with Google Meet links
- **Announcements**: Post to all students or specific groups, with priority
- **Blog CMS**: Write, edit, publish/draft, categorize articles

---

## Setup Instructions

### 1. Clone & Install

```bash
git clone <your-repo>
cd quran-academy
npm install
```

### 2. Supabase Setup

1. Go to [supabase.com](https://supabase.com) → Create new project
2. In the SQL Editor, paste and run the entire contents of **`supabase-schema.sql`**
3. Copy your project URL and API keys from Project Settings → API

### 3. Environment Variables

Create `.env.local` (copy from `.env.local.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

NEXT_PUBLIC_ADMIN_WHATSAPP=+2347076107558
NEXT_PUBLIC_SITE_NAME=Daarul Furqon Qur'an Academy
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
```

### 4. Create Admin Account

In your Supabase dashboard → Authentication → Users → Add user:
- Email: `admin@daarulfurqon.com`
- Password: your secure password

Then in SQL Editor:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'admin@daarulfurqon.com';
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment to Netlify

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com) → New site from Git
3. Connect your repo
4. Set build command: `npm run build`
5. Set publish directory: `.next`
6. Add environment variables (from `.env.local`)
7. Install the **Netlify Next.js plugin**: `@netlify/plugin-nextjs`
8. Deploy!

> **Important**: Install the Netlify Next.js plugin so server components and API routes work:
> In Netlify UI → Plugins → search "Next.js" → install

---

## Student Enrollment Flow

1. Student fills registration form at `/register`
2. Selects program, weekdays/weekends schedule (4x/week, 1hr each), time slot
3. Selects payment plan
4. After submitting, directed to WhatsApp admin (+234 707 610 7558) to send payment proof
5. Admin logs in → `/admin/registrations` → reviews registration
6. Admin goes to `/admin/students/new` → creates login credentials
7. Admin sends credentials to student via WhatsApp (auto-generated message)
8. Student logs in at `/login` → lands on dashboard with schedule + Meet links

---

## Admin Workflow: Adding a Class Session

1. Go to `/admin/sessions/new`
2. Select the group (e.g. "Foundation Weekdays A")
3. Set date, start/end time, title
4. Paste Google Meet link
5. Submit — students in that group see it on their dashboard

---

## Groups

Groups are auto-seeded in the schema:
- Foundation Weekdays/Weekends A
- Fluency Weekdays/Weekends A
- Hifz Weekdays/Weekends A
- Understanding Weekdays/Weekends A
- Advanced Weekdays/Weekends A

Add more groups via Supabase dashboard or admin panel.

---

## File Structure

```
src/
├── app/
│   ├── (public)/          # Landing, blog, register, programs
│   ├── (auth)/login/      # Login page
│   ├── (student)/dashboard/ # Student portal
│   ├── (admin)/admin/     # Admin panel
│   └── api/admin/         # Server-side API (create student)
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── public/            # Hero, Programs, Pricing, FAQ
│   ├── student/           # Student components
│   └── admin/             # Admin components
├── lib/
│   ├── supabase/          # Client + Server Supabase setup
│   └── utils.ts           # Helpers
└── types/
    └── index.ts           # All TypeScript types + program data
```

---

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Emerald 950 | `#022c22` | Nav, sidebar, hero bg |
| Emerald 600 | `#059669` | Primary buttons, accents |
| Gold 400 | `#fbbf24` | Highlights, CTA buttons |
| Gold 600 | `#d97706` | Text accents |
| White | `#ffffff` | Cards, backgrounds |

---

## Notes

- All times are WAT (GMT+1)
- Google Meet links are per-session (unique per class)
- Students select weekdays OR weekends (4 classes/week, 1 hour each)
- The admin WhatsApp number is hardcoded as `+2347076107558`
- Blog posts support simple markdown-like formatting (##, >, **)
