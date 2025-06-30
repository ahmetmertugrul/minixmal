/*
  # Fix infinite recursion in admin_users RLS policies

  1. Problem
    - Current policies check admin status by querying admin_users table itself
    - This creates infinite recursion when accessing the table

  2. Solution
    - Replace recursive policies with simpler, non-recursive ones
    - Allow users to read their own admin record directly
    - Use service role for admin management operations
    - Remove policies that cause recursion

  3. Changes
    - Drop existing problematic policies
    - Create new non-recursive policies
    - Ensure users can only see their own admin records
*/

-- Drop existing problematic policies that cause recursion
DROP POLICY IF EXISTS "Admins can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;

-- Create new non-recursive policies
-- Users can only view their own admin record (no recursion)
CREATE POLICY "Users can view own admin record"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Only allow service role to insert admin users (prevents recursion)
CREATE POLICY "Service role can insert admin users"
  ON admin_users
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Only allow service role to update admin users (prevents recursion)
CREATE POLICY "Service role can update admin users"
  ON admin_users
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow users to update their own admin record (for preferences, etc.)
CREATE POLICY "Users can update own admin record"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);