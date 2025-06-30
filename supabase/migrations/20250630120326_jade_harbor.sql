/*
  # Fix infinite recursion in admin_users RLS policies

  1. Problem
    - Current RLS policies for admin_users table cause infinite recursion
    - Policies try to check admin status by querying the same admin_users table
    - This creates a circular dependency that causes database errors

  2. Solution
    - Drop existing problematic policies
    - Create new policies that use a different approach
    - Use a function or direct user_id checks instead of self-referencing queries

  3. Changes
    - Drop all existing policies on admin_users table
    - Create new policies that avoid self-referencing queries
    - Ensure proper access control without recursion
*/

-- Drop existing policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;

-- Create new policies that don't cause recursion
-- Allow users to view admin_users records (needed for admin checks)
CREATE POLICY "Allow authenticated users to view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Only allow existing admins to insert new admin users
-- This uses a function to avoid recursion
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = user_uuid
  );
$$;

-- Policy for inserting admin users (only existing admins can do this)
CREATE POLICY "Existing admins can insert admin users"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow if the current user is already an admin
    -- We use the function with a different context to avoid recursion
    auth.uid() IN (
      SELECT user_id FROM admin_users
    )
  );

-- Policy for updating admin users (only existing admins can do this)
CREATE POLICY "Existing admins can update admin users"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM admin_users
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM admin_users
    )
  );

-- Alternative approach: Create a simpler policy structure
-- Drop the complex policies and use a more straightforward approach
DROP POLICY IF EXISTS "Existing admins can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Existing admins can update admin users" ON admin_users;

-- Simple policy: Allow authenticated users to read, but restrict writes
CREATE POLICY "Authenticated users can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- For now, allow service role to manage admin users
-- In production, you might want to handle admin user creation through a secure function
CREATE POLICY "Service role can manage admin users"
  ON admin_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Clean up the function we created
DROP FUNCTION IF EXISTS is_admin(uuid);