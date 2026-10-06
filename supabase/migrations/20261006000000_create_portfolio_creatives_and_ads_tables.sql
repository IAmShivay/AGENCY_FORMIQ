-- Create portfolio_creatives table
CREATE TABLE IF NOT EXISTS portfolio_creatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Brand Identity',
  client TEXT DEFAULT '',
  deliverables TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  media_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create portfolio_ads_seo table
CREATE TABLE IF NOT EXISTS portfolio_ads_seo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Meta Ads',
  client TEXT DEFAULT '',
  platform TEXT DEFAULT '',
  results TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  metrics JSONB DEFAULT '[]',
  media_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies for portfolio_creatives
ALTER TABLE portfolio_creatives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on portfolio_creatives"
  ON portfolio_creatives FOR SELECT
  USING (true);

CREATE POLICY "Allow admin insert on portfolio_creatives"
  ON portfolio_creatives FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Allow admin update on portfolio_creatives"
  ON portfolio_creatives FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Allow admin delete on portfolio_creatives"
  ON portfolio_creatives FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );

-- RLS policies for portfolio_ads_seo
ALTER TABLE portfolio_ads_seo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on portfolio_ads_seo"
  ON portfolio_ads_seo FOR SELECT
  USING (true);

CREATE POLICY "Allow admin insert on portfolio_ads_seo"
  ON portfolio_ads_seo FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Allow admin update on portfolio_ads_seo"
  ON portfolio_ads_seo FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Allow admin delete on portfolio_ads_seo"
  ON portfolio_ads_seo FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );

-- Auto-update updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_portfolio_creatives_updated_at
  BEFORE UPDATE ON portfolio_creatives
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_ads_seo_updated_at
  BEFORE UPDATE ON portfolio_ads_seo
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
