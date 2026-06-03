-- Fix database issues for relogin problems
-- This migration addresses RLS policies and other database issues

-- Ensure the users table has proper RLS policies
-- First, check if RLS is enabled and enable if not
DO $$
BEGIN
    -- Enable RLS on users table if not already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'users' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Admins can read all profiles" ON users;
DROP POLICY IF EXISTS "Admins can update all profiles" ON users;
DROP POLICY IF EXISTS "Admins can delete profiles" ON users;

-- Create comprehensive RLS policies for users table
-- Allow users to read their own profile
CREATE POLICY "Users can read own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- Allow authenticated users to insert their own profile (for signup)
CREATE POLICY "Users can insert own profile" 
  ON users FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Allow admins to read all user profiles
CREATE POLICY "Admins can read all profiles" 
  ON users FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM users admin_user
      WHERE admin_user.id = auth.uid() AND admin_user.is_admin = true
    )
  );

-- Allow admins to update all user profiles
CREATE POLICY "Admins can update all profiles" 
  ON users FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM users admin_user
      WHERE admin_user.id = auth.uid() AND admin_user.is_admin = true
    )
  );

-- Allow admins to delete user profiles
CREATE POLICY "Admins can delete profiles" 
  ON users FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM users admin_user
      WHERE admin_user.id = auth.uid() AND admin_user.is_admin = true
    )
  );

-- Ensure the update_updated_at_column function exists and is consistent
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure the handle_new_user function is properly defined
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Use INSERT ... ON CONFLICT to avoid duplicate key errors
  INSERT INTO public.users (id, email, full_name, is_admin)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    updated_at = NOW();
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add indexes for better performance on auth queries
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_is_admin_idx ON users(is_admin);

-- Ensure all tables have proper updated_at triggers
DO $$
DECLARE
    table_name text;
    tables_to_check text[] := ARRAY['users', 'blog_authors', 'blog_posts', 'portfolio_websites', 'portfolio_apps', 'portfolio_designs', 'contact_messages'];
BEGIN
    FOREACH table_name IN ARRAY tables_to_check
    LOOP
        -- Check if trigger exists, if not create it
        IF NOT EXISTS (
            SELECT 1 FROM pg_trigger 
            WHERE tgname = 'update_' || table_name || '_updated_at'
        ) THEN
            EXECUTE format('
                CREATE TRIGGER update_%I_updated_at
                BEFORE UPDATE ON %I
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
            ', table_name, table_name);
        END IF;
    END LOOP;
END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
