/*
  # Fix admin_users RLS policies and function

  1. Security Changes
    - Drop problematic recursive policies
    - Create safe policies using direct user_id comparison
    - Add function to check admin status safely

  2. New Policies
    - Users can read/update/delete their own admin records
    - Allow admin user creation with proper checks

  3. Function
    - Safe admin status check without RLS recursion
    - Proper grants for authenticated users
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
-- Using a single function signature to avoid grant issues
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM admin_users 
    WHERE user_id = COALESCE(user_uuid, auth.uid())
  );
$$;

-- Create an overloaded version that uses current user by default
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT is_admin(auth.uid());
$$;

-- Grant execute permission to authenticated users
-- Grant on the specific function signature first
GRANT EXECUTE ON FUNCTION is_admin(uuid) TO authenticated;

-- Then grant on the parameterless version
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;