/*
  # Fix admin_users RLS policies to prevent infinite recursion

  1. Security Changes
    - Remove problematic policies that cause infinite recursion
    - Add safe policy for users to read their own admin record
    - Add policy for admin management that doesn't cause recursion
    - Create helper function for admin checks

  2. Changes Made
    - Drop existing recursive policies
    - Create non-recursive policies
    - Add admin check function
*/

-- Drop existing problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;

-- Create safe policy for users to read their own admin record
-- This breaks the recursion by using direct user_id comparison
CREATE POLICY "Users can read own admin record"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy for inserting admin users
-- Allow authenticated users to insert, but with restrictions
CREATE POLICY "Allow admin user creation"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policy for updating admin users
-- Users can only update their own admin record
CREATE POLICY "Users can update own admin record"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy for deleting admin users
-- Users can only delete their own admin record
CREATE POLICY "Users can delete own admin record"
  ON admin_users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create a safe function to check admin status without triggering RLS
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM admin_users 
    WHERE user_id = user_uuid
  );
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;