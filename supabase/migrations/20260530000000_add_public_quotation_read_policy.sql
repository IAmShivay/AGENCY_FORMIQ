-- Add public read access for quotations (for shareable public quote links)
-- This allows anyone with the quotation UUID to view it at /quote/[id]
-- Only SELECT is granted to anon - no insert/update/delete

-- Add a SELECT policy for anonymous users (public access via shared link)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'quotations'
    AND policyname = 'Public users can view quotations by id'
  ) THEN
    CREATE POLICY "Public users can view quotations by id" ON quotations
      FOR SELECT USING (true);
  END IF;
END
$$;

-- Grant SELECT on quotations to anon role for public quote viewing
GRANT SELECT ON quotations TO anon;
