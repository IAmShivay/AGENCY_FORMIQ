-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_id uuid REFERENCES quotations(id) ON DELETE SET NULL,
  quotation_number text,
  amount numeric(12,2) NOT NULL,
  currency text DEFAULT 'INR',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  gateway text DEFAULT 'cashfree',
  payment_link text,
  payment_link_id text,
  transaction_id text,
  client_name text,
  client_email text,
  client_phone text,
  gateway_response jsonb DEFAULT '{}',
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add payment columns to quotations if not exist
DO $$ BEGIN
  ALTER TABLE quotations ADD COLUMN IF NOT EXISTS payment_link text;
  ALTER TABLE quotations ADD COLUMN IF NOT EXISTS payment_link_id text;
  ALTER TABLE quotations ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'unpaid';
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Create site_content table
CREATE TABLE IF NOT EXISTS site_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- RLS policies for payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read payments" ON payments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert payments" ON payments
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update payments" ON payments
  FOR UPDATE TO authenticated USING (true);

-- Allow service role full access (for webhooks)
CREATE POLICY "Service role full access on payments" ON payments
  FOR ALL TO service_role USING (true);

-- RLS for site_content
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site_content" ON site_content
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage site_content" ON site_content
  FOR ALL TO authenticated USING (true);

-- Index
CREATE INDEX IF NOT EXISTS idx_payments_quotation_id ON payments(quotation_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_link_id ON payments(payment_link_id);
