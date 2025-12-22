-- Migration: Add date column to rewards table
-- Run this if you already have the database set up

-- Add date column if it doesn't exist
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

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'rewards' 
  AND column_name = 'date';
