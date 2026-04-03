-- ============================================================
-- DAARUL FURQON QUR'AN ACADEMY — SUPABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE program_type AS ENUM (
  'foundation',
  'fluency',
  'hifz',
  'understanding',
  'advanced'
);

CREATE TYPE age_group AS ENUM (
  'child',
  'teen',
  'adult'
);

CREATE TYPE day_preference AS ENUM (
  'weekdays',
  'weekends'
);

CREATE TYPE payment_plan AS ENUM (
  'full',
  'installment',
  'monthly'
);

CREATE TYPE student_status AS ENUM (
  'pending',
  'active',
  'suspended',
  'completed'
);

CREATE TYPE post_status AS ENUM (
  'draft',
  'published'
);

CREATE TYPE announcement_priority AS ENUM (
  'normal',
  'important',
  'urgent'
);

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  age_group age_group,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- REGISTRATIONS (pre-login applications)
-- ============================================================

CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  age_group age_group NOT NULL,
  program program_type NOT NULL,
  day_preference day_preference NOT NULL,
  preferred_time TEXT NOT NULL, -- e.g. "09:00"
  payment_plan payment_plan NOT NULL,
  whatsapp_sent BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GROUPS
-- ============================================================

CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- e.g. "Foundation Group A"
  program program_type NOT NULL,
  day_preference day_preference NOT NULL,
  description TEXT,
  max_students INTEGER DEFAULT 15,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STUDENTS
-- ============================================================

CREATE TABLE students (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  registration_id UUID REFERENCES registrations(id),
  program program_type NOT NULL,
  group_id UUID REFERENCES groups(id),
  day_preference day_preference NOT NULL,
  preferred_time TEXT NOT NULL,
  payment_plan payment_plan NOT NULL,
  status student_status NOT NULL DEFAULT 'active',
  enrollment_date DATE DEFAULT CURRENT_DATE,
  cycle_start_date DATE DEFAULT CURRENT_DATE,
  cycle_end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SESSIONS (classes)
-- ============================================================

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  meet_link TEXT NOT NULL,
  recording_link TEXT,
  is_cancelled BOOLEAN DEFAULT FALSE,
  cancel_reason TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BLOG POSTS (CMS)
-- ============================================================

CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  status post_status DEFAULT 'draft',
  author_id UUID REFERENCES profiles(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================

CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority announcement_priority DEFAULT 'normal',
  target_group UUID REFERENCES groups(id), -- NULL = all students
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  author_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STUDENT ANNOUNCEMENTS READ TRACKING
-- ============================================================

CREATE TABLE announcement_reads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(announcement_id, student_id)
);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER sessions_updated_at BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_reads ENABLE ROW LEVEL SECURITY;

-- Helper: is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR ALL USING (is_admin());

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- STUDENTS policies
CREATE POLICY "Students can view own record" ON students
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins manage students" ON students
  FOR ALL USING (is_admin());

-- REGISTRATIONS policies
CREATE POLICY "Anyone can insert registration" ON registrations
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins can view and manage registrations" ON registrations
  FOR ALL USING (is_admin());

-- GROUPS policies
CREATE POLICY "Active students can view their group" ON groups
  FOR SELECT USING (
    is_admin() OR
    EXISTS (SELECT 1 FROM students WHERE students.group_id = groups.id AND students.id = auth.uid())
  );

CREATE POLICY "Admins manage groups" ON groups
  FOR ALL USING (is_admin());

-- SESSIONS policies
CREATE POLICY "Students can view sessions of their group" ON sessions
  FOR SELECT USING (
    is_admin() OR
    EXISTS (SELECT 1 FROM students WHERE students.group_id = sessions.group_id AND students.id = auth.uid())
  );

CREATE POLICY "Admins manage sessions" ON sessions
  FOR ALL USING (is_admin());

-- BLOG posts policies
CREATE POLICY "Published posts visible to all" ON blog_posts
  FOR SELECT USING (status = 'published' OR is_admin());

CREATE POLICY "Admins manage blog posts" ON blog_posts
  FOR ALL USING (is_admin());

-- ANNOUNCEMENTS policies
CREATE POLICY "Students view relevant announcements" ON announcements
  FOR SELECT USING (
    is_admin() OR (
      is_active = TRUE AND (
        target_group IS NULL OR
        EXISTS (SELECT 1 FROM students WHERE students.group_id = announcements.target_group AND students.id = auth.uid())
      )
    )
  );

CREATE POLICY "Admins manage announcements" ON announcements
  FOR ALL USING (is_admin());

-- ANNOUNCEMENT_READS policies
CREATE POLICY "Students manage own reads" ON announcement_reads
  FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Admins view all reads" ON announcement_reads
  FOR SELECT USING (is_admin());

-- ============================================================
-- SEED: Default Admin Groups
-- ============================================================

INSERT INTO groups (name, program, day_preference, description) VALUES
  ('Foundation Weekdays A', 'foundation', 'weekdays', 'Beginner Arabic reading - weekdays'),
  ('Foundation Weekends A', 'foundation', 'weekends', 'Beginner Arabic reading - weekends'),
  ('Fluency Weekdays A', 'fluency', 'weekdays', 'Intermediate recitation - weekdays'),
  ('Fluency Weekends A', 'fluency', 'weekends', 'Intermediate recitation - weekends'),
  ('Hifz Weekdays A', 'hifz', 'weekdays', 'Memorization track - weekdays'),
  ('Hifz Weekends A', 'hifz', 'weekends', 'Memorization track - weekends'),
  ('Understanding Weekdays A', 'understanding', 'weekdays', 'Islamic studies - weekdays'),
  ('Understanding Weekends A', 'understanding', 'weekends', 'Islamic studies - weekends'),
  ('Advanced Weekdays A', 'advanced', 'weekdays', 'Tadabbur reflection - weekdays'),
  ('Advanced Weekends A', 'advanced', 'weekends', 'Tadabbur reflection - weekends');
