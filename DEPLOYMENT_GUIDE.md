# 🚀 Deployment Guide - Push to GitHub & Deploy to Vercel

## ✅ Fixes Applied

1. **Fixed typo** in RewardPage.jsx (line 223: `false` instead of `fal{currentStreak}e`)
2. **Added `date` column** to rewards table in database-setup.sql
3. **Added `earned_at` column** for timestamp tracking

## 📋 Pre-Deployment Checklist

### Step 1: Update Supabase Database
```sql
-- Run this in Supabase SQL Editor to add missing columns
ALTER TABLE public.rewards 
ADD COLUMN IF NOT EXISTS date DATE,
ADD COLUMN IF NOT EXISTS earned_at TIMESTAMPTZ DEFAULT NOW();
```

OR re-run the entire `database-setup.sql` file (it uses `CREATE TABLE IF NOT EXISTS` so it's safe).

### Step 2: Verify Environment Variables
Make sure you have these in your `.env` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 Push to GitHub

### Option A: Using GitHub CLI (gh)
```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: Add functional streak tracking, daily rewards, and celebration modal

- Implemented real-time streak calculation from daily_claims
- Added CongratsModal with animations (trophy, particles, progress bar)
- Enhanced useRewards hook with tracking functions
- Updated database schema (user_profiles, daily_claims tables)
- Added date column to rewards table
- Fixed UI bugs and typos
- Comprehensive responsive design (11 breakpoints)
- Full RLS security on all tables"

# Push to GitHub
git push origin main
```

### Option B: Using Git Commands Only
```bash
# Initialize git if not already done
git init

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/Damilola-codes/Flowva-reward-page.git

# Stage all changes
git add .

# Commit
git commit -m "feat: Add functional streak tracking and daily rewards system"

# Push to main branch
git push -u origin main
```

## 📦 Deploy to Vercel

### Method 1: Vercel CLI (Fastest)

```bash
# Install Vercel CLI globally (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

### Method 2: Vercel Dashboard (Recommended)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Click "Add New Project"**

3. **Import Git Repository**
   - Select your GitHub account
   - Find "Flowva-reward-page"
   - Click "Import"

4. **Configure Project**
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

5. **Add Environment Variables**
   - Click "Environment Variables"
   - Add:
     - `VITE_SUPABASE_URL` = your_supabase_url
     - `VITE_SUPABASE_ANON_KEY` = your_supabase_anon_key
   - Apply to: Production, Preview, Development

6. **Click "Deploy"**
   - Wait 2-3 minutes for build
   - Vercel will provide a live URL

7. **Configure Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration steps

### Method 3: GitHub Integration (Automatic)

1. **Connect Vercel to GitHub** (one-time setup)
   - Go to Vercel Dashboard
   - Click "Import Project"
   - Authorize Vercel to access your GitHub

2. **Every Git Push Auto-Deploys**
   - Push to `main` branch → Production deployment
   - Push to other branches → Preview deployment
   - Pull requests → Automatic preview deployments

## 🔧 Vercel Configuration File

Create `vercel.json` in project root for custom configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "@supabase-url",
    "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

## ✅ Post-Deployment Verification

### 1. Test Live Site
- [ ] Open deployed URL
- [ ] Login/Signup works
- [ ] Daily claim shows modal
- [ ] Stats display correctly
- [ ] Week capsules show proper states
- [ ] Log progress button works
- [ ] Responsive on mobile

### 2. Check Vercel Logs
```bash
# View deployment logs
vercel logs

# View latest production logs
vercel logs --prod
```

### 3. Monitor Performance
- Go to Vercel Dashboard → Your Project → Analytics
- Check:
  - Build time
  - Response time
  - Error rate
  - Traffic

## 🐛 Troubleshooting Deployment Issues

### Issue: Build Fails on Vercel

**Solution 1: Check Build Logs**
```bash
# In Vercel Dashboard, click on failed deployment
# Read error messages in "Build Logs" tab
```

**Solution 2: Test Build Locally**
```bash
# Run production build locally
npm run build

# If successful, check dist/ folder
ls -la dist/

# Test production build
npm run preview
```

### Issue: Environment Variables Not Working

**Solution:**
1. Vercel Dashboard → Project Settings → Environment Variables
2. Make sure all variables are added
3. Redeploy: Deployments → Click "..." → Redeploy

### Issue: Supabase Connection Error

**Solution:**
1. Check Supabase URL and key are correct
2. Verify Supabase project is not paused
3. Check RLS policies allow authenticated access
4. Test API connection:
```bash
curl -X GET 'YOUR_SUPABASE_URL/rest/v1/user_profiles' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### Issue: 404 on Page Refresh

**Solution:** Add to `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 📊 Deployment Checklist

- [ ] All code committed to GitHub
- [ ] Database schema updated in Supabase
- [ ] Environment variables added to Vercel
- [ ] Build succeeds locally (`npm run build`)
- [ ] Deployed to Vercel
- [ ] Live site accessible
- [ ] Login/authentication works
- [ ] Daily claim functionality works
- [ ] Stats display correctly
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] Custom domain configured (optional)

## 🎯 Quick Commands Summary

```bash
# 1. Update database
# Run ALTER TABLE command in Supabase SQL Editor (see Step 1 above)

# 2. Push to GitHub
git add .
git commit -m "feat: Add functional streak tracking and daily rewards"
git push origin main

# 3. Deploy to Vercel (choose one)
vercel --prod
# OR use Vercel Dashboard

# 4. Verify deployment
curl https://your-app.vercel.app
```

## 🌐 Expected URLs

- **GitHub Repo**: `https://github.com/Damilola-codes/Flowva-reward-page`
- **Vercel Deployment**: `https://flowva-reward-page.vercel.app` (or custom domain)
- **Vercel Dashboard**: `https://vercel.com/damilola-codes/flowva-reward-page`

## 🔐 Security Notes

1. **Never commit `.env` file** (add to `.gitignore`)
2. **Use Vercel environment variables** for secrets
3. **Enable RLS** on all Supabase tables
4. **Rotate keys** if accidentally exposed
5. **Use HTTPS** for production (Vercel provides automatically)

## 🚀 Ready to Deploy!

Run these commands now:

```bash
# Update database first
echo "Go to Supabase SQL Editor and run:"
echo "ALTER TABLE public.rewards ADD COLUMN IF NOT EXISTS date DATE, ADD COLUMN IF NOT EXISTS earned_at TIMESTAMPTZ DEFAULT NOW();"

# Then push and deploy
git add .
git commit -m "feat: Complete functional features implementation"
git push origin main

# Deploy to Vercel
vercel --prod
```

**Your app will be live in ~3 minutes! 🎉**
