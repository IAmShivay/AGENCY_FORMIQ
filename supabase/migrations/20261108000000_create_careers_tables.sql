-- Careers: open roles (managed in admin) and applications (submitted from /careers)

CREATE TABLE IF NOT EXISTS job_openings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 2 AND 120),
  team TEXT NOT NULL DEFAULT 'Design',
  location TEXT NOT NULL DEFAULT 'Kolkata, India',
  work_mode TEXT NOT NULL DEFAULT 'On-site' CHECK (work_mode IN ('On-site', 'Hybrid', 'Remote')),
  employment_type TEXT NOT NULL DEFAULT 'Full-time' CHECK (employment_type IN ('Full-time', 'Part-time', 'Contract', 'Internship')),
  summary TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  responsibilities TEXT[] NOT NULL DEFAULT '{}',
  requirements TEXT[] NOT NULL DEFAULT '{}',
  nice_to_have TEXT[] NOT NULL DEFAULT '{}',
  salary TEXT NOT NULL DEFAULT '',
  is_open BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS job_openings_open_idx ON job_openings(is_open, created_at DESC);

CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opening_id UUID REFERENCES job_openings(id) ON DELETE SET NULL,
  role_title TEXT NOT NULL DEFAULT 'Open application' CHECK (char_length(role_title) <= 120),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  email TEXT NOT NULL CHECK (char_length(email) <= 254 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone TEXT CHECK (phone IS NULL OR char_length(phone) <= 40),
  location TEXT CHECK (location IS NULL OR char_length(location) <= 120),
  portfolio_url TEXT CHECK (portfolio_url IS NULL OR (char_length(portfolio_url) <= 500 AND portfolio_url ~* '^https?://')),
  linkedin_url TEXT CHECK (linkedin_url IS NULL OR (char_length(linkedin_url) <= 500 AND linkedin_url ~* '^https?://')),
  cv_url TEXT CHECK (cv_url IS NULL OR (char_length(cv_url) <= 500 AND cv_url ~* '^https?://')),
  message TEXT CHECK (message IS NULL OR char_length(message) <= 4000),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'interview', 'offer', 'hired', 'rejected')),
  consent BOOLEAN NOT NULL CHECK (consent = true),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS job_applications_created_idx ON job_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS job_applications_opening_idx ON job_applications(opening_id);

ALTER TABLE job_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read open roles"
  ON job_openings FOR SELECT
  USING (is_open = true OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admins can insert roles"
  ON job_openings FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admins can update roles"
  ON job_openings FOR UPDATE
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admins can delete roles"
  ON job_openings FOR DELETE
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Anyone can apply"
  ON job_applications FOR INSERT
  WITH CHECK (status = 'new');

CREATE POLICY "Admins can read applications"
  ON job_applications FOR SELECT
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admins can update applications"
  ON job_applications FOR UPDATE
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admins can delete applications"
  ON job_applications FOR DELETE
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true));
