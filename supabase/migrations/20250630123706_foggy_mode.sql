/*
  # Create Admin User for ahmet.m.ertugrul@gmail.com

  1. Admin User Creation
    - Find user by email ahmet.m.ertugrul@gmail.com
    - Create admin record with full permissions
    - Grant super_admin role with all privileges

  2. Permissions Granted
    - full_access: true (bypass all restrictions)
    - pro_features: true (access to all Pro features)
    - unlimited_content: true (unlimited tasks, articles, AI usage)
    - admin_dashboard: true (access to admin panel)
    - user_management: true (can create other admins)

  3. Error Handling
    - Only create admin record if user exists
    - Handle case where user doesn't exist yet
    - Avoid duplicate admin records
*/

-- Create admin user for ahmet.m.ertugrul@gmail.com
DO $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Find the user by email
  SELECT id INTO target_user_id
  FROM auth.users 
  WHERE email = 'ahmet.m.ertugrul@gmail.com';

  -- Only proceed if user exists
  IF target_user_id IS NOT NULL THEN
    -- Insert admin record (or update if exists)
    INSERT INTO admin_users (user_id, role, permissions)
    VALUES (
      target_user_id,
      'super_admin',
      '{
        "full_access": true,
        "pro_features": true,
        "unlimited_content": true,
        "admin_dashboard": true,
        "user_management": true
      }'::jsonb
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET
      role = 'super_admin',
      permissions = '{
        "full_access": true,
        "pro_features": true,
        "unlimited_content": true,
        "admin_dashboard": true,
        "user_management": true
      }'::jsonb,
      updated_at = now();

    RAISE NOTICE 'Admin user created/updated for ahmet.m.ertugrul@gmail.com';
  ELSE
    RAISE NOTICE 'User ahmet.m.ertugrul@gmail.com not found. Please sign up first, then run this migration again.';
  END IF;
END $$;