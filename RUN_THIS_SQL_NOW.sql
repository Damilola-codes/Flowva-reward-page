-- CRITICAL: Run this in Supabase SQL Editor NOW!
-- This creates the missing tables causing your errors

-- 1. Create user_profiles table
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

-- 2. Create daily_claims table
CREATE TABLE IF NOT EXISTS public.daily_claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  claim_date DATE NOT NULL DEFAULT CURRENT_DATE,
  points_awarded INTEGER NOT NULL DEFAULT 5,
  streak_day INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, claim_date)
);

-- 3. Add date column to rewards if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'rewards' 
    AND column_name = 'date'
  ) THEN
    ALTER TABLE public.rewards ADD COLUMN date DATE;
  END IF;
END $$;

-- 4. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_claims ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies for user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile"
ON public.user_profiles FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile"
ON public.user_profiles FOR INSERT
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile"
ON public.user_profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 6. Create RLS Policies for daily_claims
DROP POLICY IF EXISTS "Users can view own claims" ON public.daily_claims;
CREATE POLICY "Users can view own claims"
ON public.daily_claims FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own claims" ON public.daily_claims;
CREATE POLICY "Users can insert own claims"
ON public.daily_claims FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 7. Create trigger to auto-create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, signup_date)
  VALUES (NEW.id, NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- 8. Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER set_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- DONE! Now refresh your app (Ctrl+Shift+R) and it should work!
