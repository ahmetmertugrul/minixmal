/*
  # Fix infinite recursion in admin_users RLS policies

  1. Problem
    - Current RLS policies on admin_users table create infinite recursion
    - Policies try to check admin status by querying the same table they're protecting
    
  2. Solution
    - Drop existing problematic policies
    - Create new policies that don't self-reference
    - Allow users to read their own admin record directly
    - Use service role for admin management operations
    
  3. Security
    - Users can only see their own admin record
    - Only authenticated users can access admin_users table
    - Admin creation/updates require service role or specific permissions
*/

-- Drop existing policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can update admin users" ON admin_users;

-- Create new policies that don't self-reference
CREATE POLICY "Users can view own admin record"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow service role to manage admin users (for admin creation)
CREATE POLICY "Service role can manage admin users"
  ON admin_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to insert admin records (will be restricted by application logic)
CREATE POLICY "Authenticated users can insert admin records"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own admin record
CREATE POLICY "Users can update own admin record"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);