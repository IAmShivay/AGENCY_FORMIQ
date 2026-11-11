-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('formiqstudio', 'formiqstudio', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create storage policies
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'formiqstudio');

CREATE POLICY "Allow authenticated users to upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'formiqstudio' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update their files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'formiqstudio' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete their files" ON storage.objects
  FOR DELETE USING (bucket_id = 'formiqstudio' AND auth.role() = 'authenticated');
