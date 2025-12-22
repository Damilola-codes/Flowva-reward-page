# 🚀 Quick Deployment Steps

## Step 1: Run Database Migration

1. Open Supabase Dashboard → SQL Editor
2. Copy and run this SQL:

```sql
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
```

3. ✅ Done! Date column added

---

## Step 2: Push to GitHub

Run these commands in terminal:

```bash
# Stage all changes
git add .

# Commit
git commit -m "feat: Add functional features - streak system, daily rewards, celebration modal"

# Push to GitHub
git push origin main
```

---

## Step 3: Deploy to Vercel

### Option A: Via Dashboard (Easiest)

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import `Damilola-codes/Flowva-reward-page`
4. Add environment variables:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
5. Click "Deploy"
6. ✅ Live in 2-3 minutes!

### Option B: Via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## Step 4: Configure Supabase

1. Go to Supabase → Authentication → URL Configuration
2. Add your Vercel URL to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: `https://your-app.vercel.app/**`

---

## ✅ Test Your Deployment

1. Visit your Vercel URL
2. Sign up / Login
3. Click "Claim +5" → Modal should appear
4. Log a manual win → Should save with date
5. Check stats update in real-time

---

## 🐛 Troubleshooting

**Build fails?**
- Run `npm run build` locally to test
- Check for errors in Vercel logs

**Database errors?**
- Verify environment variables in Vercel
- Check Supabase RLS policies enabled
- Run database-migration.sql

**Auth redirects fail?**
- Add Vercel domain to Supabase allowed URLs
- Format: `https://your-app.vercel.app/**`

---

**That's it! Your app is live! 🎉**
