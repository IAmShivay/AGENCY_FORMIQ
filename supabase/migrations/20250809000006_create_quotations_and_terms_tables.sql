-- Simple quotations table creation
CREATE TABLE quotations (
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

-- Create indexes
CREATE INDEX idx_quotations_status ON quotations(status);
CREATE INDEX idx_quotations_client_email ON quotations(client_email);
CREATE INDEX idx_quotations_created_at ON quotations(created_at);
CREATE INDEX idx_quotations_quotation_number ON quotations(quotation_number);

-- Enable RLS
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- Simple policy - allow all authenticated users
CREATE POLICY "Allow authenticated users" ON quotations FOR ALL USING (auth.role() = 'authenticated');

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_quotations_updated_at
  BEFORE UPDATE ON quotations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create terms_templates table
CREATE TABLE terms_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID
);

-- Create indexes for terms_templates
CREATE INDEX idx_terms_templates_is_default ON terms_templates(is_default);
CREATE INDEX idx_terms_templates_created_at ON terms_templates(created_at);

-- Enable RLS for terms_templates
ALTER TABLE terms_templates ENABLE ROW LEVEL SECURITY;

-- Policy for terms_templates
CREATE POLICY "Allow authenticated users" ON terms_templates FOR ALL USING (auth.role() = 'authenticated');

-- Trigger for terms_templates updated_at
CREATE TRIGGER update_terms_templates_updated_at
  BEFORE UPDATE ON terms_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default terms template
INSERT INTO terms_templates (name, content, is_default) VALUES (
  'Default Terms & Conditions',
  '1. Payment terms: 30% advance, 40% on milestone completion, 30% on delivery
2. All prices are in Indian Rupees (INR)
3. Additional revisions beyond agreed limit will be charged separately
4. Project timeline may vary based on client feedback and approvals
5. Source code and assets will be delivered upon full payment
6. FormiqStudio retains the right to showcase the project in our portfolio
7. Client is responsible for providing all necessary content and materials
8. Any third-party licenses or subscriptions are client''s responsibility
9. Support and maintenance terms as specified in the project scope
10. Disputes will be resolved through mutual discussion or legal arbitration',
  true
);
