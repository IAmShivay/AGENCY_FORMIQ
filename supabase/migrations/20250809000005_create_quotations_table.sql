-- Create quotations table
CREATE TABLE IF NOT EXISTS quotations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_number VARCHAR(50) NOT NULL UNIQUE,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(20),
  client_company VARCHAR(255),
  project_title VARCHAR(500) NOT NULL,
  project_description TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  milestones JSONB NOT NULL DEFAULT '[]',
  key_features JSONB NOT NULL DEFAULT '[]',
  scope_of_work TEXT,
  revisions INTEGER DEFAULT 3,
  maintenance_period VARCHAR(100) DEFAULT '6 months',
  delivery_timeline VARCHAR(100),
  terms_conditions TEXT,
  subtotal DECIMAL(12,2) DEFAULT 0,
  tax_percentage DECIMAL(5,2) DEFAULT 18,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) DEFAULT 0,
  valid_until DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotations_client_email ON quotations(client_email);
CREATE INDEX IF NOT EXISTS idx_quotations_created_at ON quotations(created_at);
CREATE INDEX IF NOT EXISTS idx_quotations_quotation_number ON quotations(quotation_number);

-- Enable Row Level Security (RLS)
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- Create policies for quotations
-- Allow authenticated users to manage quotations (you can restrict this later based on your user system)
CREATE POLICY "Authenticated users can manage quotations" ON quotations
  FOR ALL USING (auth.role() = 'authenticated');

-- Alternative: If you want to restrict to specific users, you can use email-based policy
-- CREATE POLICY "Admin users can manage quotations" ON quotations
--   FOR ALL USING (
--     auth.jwt() ->> 'email' IN ('admin@formiqstudio.com', 'manager@formiqstudio.com')
--   );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_quotations_updated_at 
  BEFORE UPDATE ON quotations 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON quotations TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
