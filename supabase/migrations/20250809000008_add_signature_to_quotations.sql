-- Add signature fields to quotations table
ALTER TABLE quotations 
ADD COLUMN IF NOT EXISTS signature_id UUID,
ADD COLUMN IF NOT EXISTS signature_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS signature_role VARCHAR(255),
ADD COLUMN IF NOT EXISTS signature_image_url TEXT;
