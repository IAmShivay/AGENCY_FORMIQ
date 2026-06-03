-- Create leads table based on admin interface structure
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  project_type TEXT,
  budget TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'proposal_sent', 'negotiating', 'won', 'lost')),
  description TEXT,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);
CREATE INDEX IF NOT EXISTS leads_assigned_to_idx ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at);
CREATE INDEX IF NOT EXISTS leads_company_idx ON leads(company);

-- Enable RLS on leads table
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for leads table
-- Allow authenticated users to read leads (we'll handle role-based access in application)
CREATE POLICY "Authenticated users can read leads" 
  ON leads FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert leads
CREATE POLICY "Authenticated users can insert leads" 
  ON leads FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update leads
CREATE POLICY "Authenticated users can update leads" 
  ON leads FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete leads
CREATE POLICY "Authenticated users can delete leads" 
  ON leads FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add some sample data for testing (optional)
-- INSERT INTO leads (name, email, phone, company, project_type, budget, status, description) VALUES
-- ('John Doe', 'john@example.com', '+1234567890', 'Example Corp', 'Web Development', '$10,000 - $25,000', 'new', 'Looking for a modern website redesign'),
-- ('Jane Smith', 'jane@company.com', '+1987654321', 'Tech Solutions', 'Mobile App', '$25,000 - $50,000', 'contacted', 'Need a mobile app for their business'),
-- ('Bob Johnson', 'bob@startup.io', '+1122334455', 'Startup Inc', 'Full Stack', '$50,000+', 'proposal_sent', 'Complete digital transformation project');

-- Add comments for documentation
COMMENT ON TABLE leads IS 'Customer leads and prospects for business development';
COMMENT ON COLUMN leads.status IS 'Lead status: new, contacted, proposal_sent, negotiating, won, lost';
COMMENT ON COLUMN leads.assigned_to IS 'User ID of the team member assigned to this lead';
COMMENT ON COLUMN leads.attachments IS 'JSON array of attachment metadata (name, url, size, type, uploaded_at)';
COMMENT ON COLUMN leads.budget IS 'Estimated project budget range';
COMMENT ON COLUMN leads.project_type IS 'Type of project or service requested';
