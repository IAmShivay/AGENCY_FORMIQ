-- Update policies to check for admin status
DROP POLICY IF EXISTS "Authenticated users can insert blog authors" ON blog_authors;
DROP POLICY IF EXISTS "Authenticated users can update blog authors" ON blog_authors;
DROP POLICY IF EXISTS "Authenticated users can delete blog authors" ON blog_authors;

DROP POLICY IF EXISTS "Authenticated users can insert blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete blog posts" ON blog_posts;

-- Create admin-only policies for blog_authors
CREATE POLICY "Only admins can insert blog authors" 
  ON blog_authors FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

CREATE POLICY "Only admins can update blog authors" 
  ON blog_authors FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

CREATE POLICY "Only admins can delete blog authors" 
  ON blog_authors FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Create admin-only policies for blog_posts
CREATE POLICY "Only admins can insert blog posts" 
  ON blog_posts FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

CREATE POLICY "Only admins can update blog posts" 
  ON blog_posts FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

CREATE POLICY "Only admins can delete blog posts" 
  ON blog_posts FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );
