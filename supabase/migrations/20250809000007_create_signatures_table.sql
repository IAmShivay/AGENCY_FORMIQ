-- Create signatures table
CREATE TABLE signatures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID
);

-- Create indexes
CREATE INDEX idx_signatures_is_default ON signatures(is_default);
CREATE INDEX idx_signatures_created_at ON signatures(created_at);

-- Enable RLS
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow authenticated users" ON signatures FOR ALL USING (auth.role() = 'authenticated');

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_signatures_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_signatures_updated_at 
  BEFORE UPDATE ON signatures 
  FOR EACH ROW 
  EXECUTE FUNCTION update_signatures_updated_at();
