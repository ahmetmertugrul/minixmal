/*
  # Create onboarding profiles table

  1. New Tables
    - `onboarding_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `primary_goals` (text array)
      - `current_state` (jsonb)
      - `preferences` (jsonb)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `onboarding_profiles` table
    - Add policy for users to read/write their own onboarding data
*/

CREATE TABLE IF NOT EXISTS onboarding_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  primary_goals text[] DEFAULT '{}',
  current_state jsonb DEFAULT '{}',
  preferences jsonb DEFAULT '{}',
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create unique index to ensure one profile per user
CREATE UNIQUE INDEX IF NOT EXISTS onboarding_profiles_user_id_idx ON onboarding_profiles(user_id);

-- Enable RLS
ALTER TABLE onboarding_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own onboarding profile"
  ON onboarding_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding profile"
  ON onboarding_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding profile"
  ON onboarding_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_onboarding_profiles_updated_at
  BEFORE UPDATE ON onboarding_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();