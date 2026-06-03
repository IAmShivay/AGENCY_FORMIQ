-- Create portfolio_designs table
CREATE TABLE IF NOT EXISTS portfolio_designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  category TEXT NOT NULL,
  client TEXT,
  link TEXT,
  year TEXT,
  services TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS portfolio_designs_category_idx ON portfolio_designs(category);
CREATE INDEX IF NOT EXISTS portfolio_designs_year_idx ON portfolio_designs(year);

-- Create RLS policies for portfolio_designs
ALTER TABLE portfolio_designs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read portfolio designs
CREATE POLICY "Anyone can read portfolio designs" 
  ON portfolio_designs FOR SELECT 
  USING (true);

-- Only admins can modify portfolio designs
CREATE POLICY "Only admins can insert portfolio designs" 
  ON portfolio_designs FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

CREATE POLICY "Only admins can update portfolio designs" 
  ON portfolio_designs FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

CREATE POLICY "Only admins can delete portfolio designs" 
  ON portfolio_designs FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_portfolio_designs_updated_at
BEFORE UPDATE ON portfolio_designs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
