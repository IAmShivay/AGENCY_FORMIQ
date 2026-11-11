-- Add employee and manager roles to users table
-- This migration adds is_employee and is_manager columns to support role-based access control

-- Add new role columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_employee BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_manager BOOLEAN DEFAULT FALSE;

-- Add indexes for better performance on role queries
CREATE INDEX IF NOT EXISTS users_is_employee_idx ON users(is_employee);
CREATE INDEX IF NOT EXISTS users_is_manager_idx ON users(is_manager);

-- Update RLS policies to include employee and manager roles
-- Drop existing policies to recreate them with new role support
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Admins can read all profiles" ON users;
DROP POLICY IF EXISTS "Admins can update all profiles" ON users;
DROP POLICY IF EXISTS "Admins can delete profiles" ON users;

-- Create comprehensive RLS policies for users table with role support
-- Allow users to read their own profile
CREATE POLICY "Users can read own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

-- Allow users to update their own profile (but not their role fields)
CREATE POLICY "Users can update own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    -- Prevent users from changing their own role fields
    (is_admin = OLD.is_admin) AND
    (is_employee = OLD.is_employee) AND
    (is_manager = OLD.is_manager)
  );

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

-- Allow admins to update all user profiles (including role assignments)
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

-- Allow managers to read employee profiles
CREATE POLICY "Managers can read employee profiles" 
  ON users FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM users manager_user
      WHERE manager_user.id = auth.uid() AND manager_user.is_manager = true
    ) AND is_employee = true
  );

-- Allow managers to update employee profiles (but not role fields)
CREATE POLICY "Managers can update employee profiles" 
  ON users FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM users manager_user
      WHERE manager_user.id = auth.uid() AND manager_user.is_manager = true
    ) AND is_employee = true
  )
  WITH CHECK (
    -- Prevent managers from changing role fields
    (is_admin = OLD.is_admin) AND
    (is_employee = OLD.is_employee) AND
    (is_manager = OLD.is_manager)
  );

-- Update contact_messages policies to include manager access
DROP POLICY IF EXISTS "Only admins can read contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Only admins can update contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Only admins can delete contact messages" ON contact_messages;

-- Allow admins and managers to read contact messages
CREATE POLICY "Admins and managers can read contact messages" 
  ON contact_messages FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND (users.is_admin = true OR users.is_manager = true)
    )
  );

-- Allow admins and managers to update contact messages
CREATE POLICY "Admins and managers can update contact messages" 
  ON contact_messages FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND (users.is_admin = true OR users.is_manager = true)
    )
  );

-- Allow only admins to delete contact messages
CREATE POLICY "Only admins can delete contact messages" 
  ON contact_messages FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Update the handle_new_user function to include new role fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Use INSERT ... ON CONFLICT to avoid duplicate key errors
  INSERT INTO public.users (id, email, full_name, is_admin, is_employee, is_manager)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    false,
    false,
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    updated_at = NOW();
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON COLUMN users.is_admin IS 'Full administrative access to all system features';
COMMENT ON COLUMN users.is_employee IS 'Employee access with limited permissions';
COMMENT ON COLUMN users.is_manager IS 'Manager access with employee management permissions';
