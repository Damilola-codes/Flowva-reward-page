-- FlowvaHub Rewards Database Setup
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Create user_profiles table for tracking user stats
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_login_date DATE,
  signup_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  total_logins INTEGER DEFAULT 1,
  last_claim_date DATE,
  completed_wins INTEGER DEFAULT 0,
  avg_points_per_day DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create rewards table
CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  points INTEGER NOT NULL DEFAULT 0,
  icon TEXT DEFAULT 'star',
  completed BOOLEAN DEFAULT false,
  date DATE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create redemptions table
CREATE TABLE IF NOT EXISTS public.redemptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_id TEXT NOT NULL,
  item_title TEXT NOT NULL,
  points_spent INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create daily_claims table to track daily rewards
CREATE TABLE IF NOT EXISTS public.daily_claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  claim_date DATE NOT NULL DEFAULT CURRENT_DATE,
  points_awarded INTEGER NOT NULL DEFAULT 5,
  streak_day INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, claim_date)
);

-- ============================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Index on user_id for user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_user 
ON public.user_profiles(id);

-- Index on user_id and created_at for rewards
CREATE INDEX IF NOT EXISTS idx_rewards_user_created 
ON public.rewards(user_id, created_at DESC);

-- Index on user_id and created_at for redemptions
CREATE INDEX IF NOT EXISTS idx_redemptions_user_created 
ON public.redemptions(user_id, created_at DESC);

-- Index on user_id and claim_date for daily_claims
CREATE INDEX IF NOT EXISTS idx_daily_claims_user_date 
ON public.daily_claims(user_id, claim_date DESC);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on user_profiles table
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on rewards table
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

-- Enable RLS on redemptions table
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;

-- Enable RLS on daily_claims table
ALTER TABLE public.daily_claims ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CREATE RLS POLICIES
-- ============================================

-- User Profiles Table Policies

-- Policy: Users can view only their own profile
CREATE POLICY "Users can view own profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON public.user_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Policy: Users can update only their own profile
CREATE POLICY "Users can update own profile"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Rewards Table Policies

-- Policy: Users can view only their own rewards
CREATE POLICY "Users can view own rewards"
ON public.rewards
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own rewards
CREATE POLICY "Users can insert own rewards"
ON public.rewards
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update only their own rewards
CREATE POLICY "Users can update own rewards"
ON public.rewards
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete only their own rewards
CREATE POLICY "Users can delete own rewards"
ON public.rewards
FOR DELETE
USING (auth.uid() = user_id);

-- Redemptions Table Policies

-- Policy: Users can view only their own redemptions
CREATE POLICY "Users can view own redemptions"
ON public.redemptions
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own redemptions
CREATE POLICY "Users can insert own redemptions"
ON public.redemptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update only their own redemptions
CREATE POLICY "Users can update own redemptions"
ON public.redemptions
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete only their own redemptions
CREATE POLICY "Users can delete own redemptions"
ON public.redemptions
FOR DELETE
USING (auth.uid() = user_id);

-- Daily Claims Table Policies

-- Policy: Users can view only their own claims
CREATE POLICY "Users can view own claims"
ON public.daily_claims
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own claims
CREATE POLICY "Users can insert own claims"
ON public.daily_claims
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 5. CREATE FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for rewards table
CREATE TRIGGER set_rewards_updated_at
BEFORE UPDATE ON public.rewards
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for user_profiles table
CREATE TRIGGER set_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, signup_date)
  VALUES (NEW.id, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 6. CREATE HELPER FUNCTIONS
-- ============================================

-- Function to calculate user stats
CREATE OR REPLACE FUNCTION public.get_user_stats(p_user_id UUID)
RETURNS TABLE (
  total_points BIGINT,
  completed_wins INTEGER,
  current_streak INTEGER,
  avg_points_per_day DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(r.points), 0)::BIGINT as total_points,
    COALESCE(COUNT(*) FILTER (WHERE r.completed = true), 0)::INTEGER as completed_wins,
    COALESCE(up.current_streak, 0) as current_streak,
    COALESCE(up.avg_points_per_day, 0) as avg_points_per_day
  FROM public.user_profiles up
  LEFT JOIN public.rewards r ON up.id = r.user_id
  WHERE up.id = p_user_id
  GROUP BY up.id, up.current_streak, up.avg_points_per_day;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. INSERT SAMPLE DATA (OPTIONAL)
-- ============================================

-- Uncomment the following lines to insert sample data for testing
-- Replace 'YOUR_USER_ID' with your actual user ID from auth.users

/*
INSERT INTO public.rewards (user_id, title, description, points, icon, completed) VALUES
('YOUR_USER_ID', 'Completed daily challenge', 'Finished all tasks for today', 50, 'trophy', true),
('YOUR_USER_ID', 'Referred a friend', 'Successfully referred John Doe', 100, 'users', true),
('YOUR_USER_ID', 'Shared content on social media', 'Posted about FlowvaHub on Twitter', 25, 'share', true);
*/

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if tables were created successfully
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('rewards', 'redemptions');

-- Check RLS policies
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- After running this script, refresh your Supabase schema cache
-- and your application should be able to fetch rewards and redemptions.
