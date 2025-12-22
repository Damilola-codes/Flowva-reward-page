-- Quick fix to add missing columns to rewards table
-- Run this in Supabase SQL Editor if you already created the tables

ALTER TABLE public.rewards 
ADD COLUMN IF NOT EXISTS date DATE,
ADD COLUMN IF NOT EXISTS earned_at TIMESTAMPTZ DEFAULT NOW();

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'rewards' 
ORDER BY ordinal_position;
