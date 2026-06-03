-- Create blog_authors table
CREATE TABLE IF NOT EXISTS blog_authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  reading_time INTEGER DEFAULT 5,
  author_id UUID REFERENCES blog_authors(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_category_idx ON blog_posts(category);
CREATE INDEX IF NOT EXISTS blog_posts_author_id_idx ON blog_posts(author_id);

-- Note: Storage bucket for blog images needs to be created manually in the Supabase dashboard
-- Go to Storage > Create a new bucket named 'blog-images' and set it to public

-- Create RLS policies for blog_authors
ALTER TABLE blog_authors ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read blog authors
CREATE POLICY "Anyone can read blog authors" 
  ON blog_authors FOR SELECT 
  USING (true);

-- Allow any authenticated user to insert/update/delete blog authors for now
-- We'll update these policies later to check for admin status
CREATE POLICY "Authenticated users can insert blog authors" 
  ON blog_authors FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update blog authors" 
  ON blog_authors FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete blog authors" 
  ON blog_authors FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Create RLS policies for blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read blog posts
CREATE POLICY "Anyone can read blog posts" 
  ON blog_posts FOR SELECT 
  USING (true);

-- Allow any authenticated user to insert/update/delete blog posts for now
-- We'll update these policies later to check for admin status
CREATE POLICY "Authenticated users can insert blog posts" 
  ON blog_posts FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update blog posts" 
  ON blog_posts FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete blog posts" 
  ON blog_posts FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_blog_authors_updated_at
BEFORE UPDATE ON blog_authors
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
