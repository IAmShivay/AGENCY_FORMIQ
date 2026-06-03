-- Create portfolio_websites table
CREATE TABLE IF NOT EXISTS portfolio_websites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  tags TEXT[] DEFAULT '{}',
  link TEXT,
  category TEXT NOT NULL,
  completion_date TEXT,
  features TEXT[] DEFAULT '{}',
  live_link TEXT,
  repo_link TEXT,
  case_study_challenge TEXT,
  case_study_solution TEXT,
  case_study_results TEXT,
  case_study_testimonial TEXT,
  case_study_screens TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create portfolio_apps table
CREATE TABLE IF NOT EXISTS portfolio_apps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  tags TEXT[] DEFAULT '{}',
  platforms TEXT[] DEFAULT '{}',
  link TEXT,
  features TEXT[] DEFAULT '{}',
  year TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS portfolio_websites_category_idx ON portfolio_websites(category);
CREATE INDEX IF NOT EXISTS portfolio_apps_year_idx ON portfolio_apps(year);

-- Create RLS policies for portfolio_websites
ALTER TABLE portfolio_websites ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read portfolio websites
CREATE POLICY "Anyone can read portfolio websites" 
  ON portfolio_websites FOR SELECT 
  USING (true);

-- Only admins can modify portfolio websites
CREATE POLICY "Only admins can insert portfolio websites" 
  ON portfolio_websites FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

CREATE POLICY "Only admins can update portfolio websites" 
  ON portfolio_websites FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

CREATE POLICY "Only admins can delete portfolio websites" 
  ON portfolio_websites FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Create RLS policies for portfolio_apps
ALTER TABLE portfolio_apps ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read portfolio apps
CREATE POLICY "Anyone can read portfolio apps" 
  ON portfolio_apps FOR SELECT 
  USING (true);

-- Only admins can modify portfolio apps
CREATE POLICY "Only admins can insert portfolio apps" 
  ON portfolio_apps FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

CREATE POLICY "Only admins can update portfolio apps" 
  ON portfolio_apps FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

CREATE POLICY "Only admins can delete portfolio apps" 
  ON portfolio_apps FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_portfolio_websites_updated_at
BEFORE UPDATE ON portfolio_websites
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_apps_updated_at
BEFORE UPDATE ON portfolio_apps
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
