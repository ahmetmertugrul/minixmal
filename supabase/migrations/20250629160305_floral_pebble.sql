/*
  # Create user stats and points transactions tables

  1. New Tables
    - `user_stats`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `total_points` (integer, default 0)
      - `level` (integer, default 1)
      - `experience_points` (integer, default 0)
      - `points_to_next_level` (integer, default 250)
      - `streak_days` (integer, default 0)
      - `longest_streak` (integer, default 0)
      - `tasks_completed` (integer, default 0)
      - `articles_read` (integer, default 0)
      - `rooms_transformed` (integer, default 0)
      - `badges_earned` (text array, default empty)
      - `achievements_unlocked` (text array, default empty)
      - `last_activity` (timestamptz, default now)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)
    
    - `points_transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `points` (integer)
      - `type` (text)
      - `source_id` (text, optional)
      - `source_type` (text, optional)
      - `description` (text)
      - `created_at` (timestamptz, default now)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data

  3. Indexes
    - Add index on user_id for both tables for better performance
*/

-- Create user_stats table
CREATE TABLE IF NOT EXISTS public.user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_points integer DEFAULT 0 NOT NULL,
  level integer DEFAULT 1 NOT NULL,
  experience_points integer DEFAULT 0 NOT NULL,
  points_to_next_level integer DEFAULT 250 NOT NULL,
  streak_days integer DEFAULT 0 NOT NULL,
  longest_streak integer DEFAULT 0 NOT NULL,
  tasks_completed integer DEFAULT 0 NOT NULL,
  articles_read integer DEFAULT 0 NOT NULL,
  rooms_transformed integer DEFAULT 0 NOT NULL,
  badges_earned text[] DEFAULT '{}'::text[] NOT NULL,
  achievements_unlocked text[] DEFAULT '{}'::text[] NOT NULL,
  last_activity timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create points_transactions table
CREATE TABLE IF NOT EXISTS public.points_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  points integer NOT NULL,
  type text NOT NULL,
  source_id text,
  source_type text,
  description text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_stats
CREATE POLICY "Users can view their own user stats"
  ON public.user_stats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own user stats"
  ON public.user_stats
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own user stats"
  ON public.user_stats
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for points_transactions
CREATE POLICY "Users can view their own points transactions"
  ON public.points_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own points transactions"
  ON public.points_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS user_stats_user_id_idx ON public.user_stats(user_id);
CREATE INDEX IF NOT EXISTS points_transactions_user_id_idx ON public.points_transactions(user_id);
CREATE INDEX IF NOT EXISTS points_transactions_created_at_idx ON public.points_transactions(created_at DESC);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_user_stats_updated_at'
  ) THEN
    CREATE TRIGGER update_user_stats_updated_at
      BEFORE UPDATE ON public.user_stats
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;