/*
  # Fix infinite recursion in admin_users RLS policies

  1. Security Changes
    - Drop existing recursive policies that cause infinite loops
    - Add safe policies that allow users to read their own admin record
    - Add policies for super admin operations using a different approach
  
  2. Policy Changes
    - Users can read their own admin_users record (prevents recursion)
    - Only allow inserts/updates through application logic or direct database access
    - Remove circular dependency in policy conditions
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;

-- Create safe policy for users to read their own admin record
CREATE POLICY "Users can read own admin record"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy for inserting admin users (restricted to service role or specific conditions)
CREATE POLICY "Service role can insert admin users"
  ON admin_users
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Create policy for updating admin users (restricted to service role)
CREATE POLICY "Service role can update admin users"
  ON admin_users
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Optional: Create a function to safely check admin status without recursion
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM admin_users 
    WHERE user_id = user_uuid
  );
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;