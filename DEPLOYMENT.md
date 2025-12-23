# Deployment Guide

This guide will help you deploy the Flowva Rewards application to a live hosting platform.

## Prerequisites

Before deploying, ensure you have:

1. ✅ A [Supabase account](https://supabase.com) with your project created and database schema set up
2. ✅ Your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` ready (from Supabase → Settings → API)
3. ✅ Your code pushed to a GitHub repository
4. ✅ Node.js 18+ installed locally

## Option 1: Deploy to Vercel (Recommended)

Vercel offers the easiest deployment experience for Vite + React applications with serverless functions and edge caching.

### Step 1: Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click **"New Project"**
3. Select your `Flowva-reward-page` repository
4. Click **"Import"**

### Step 2: Configure Environment Variables

On the **"Configure Project"** screen:

1. Under **"Environment Variables"**, add:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://your-project.supabase.co` (your actual Supabase URL)

2. Add another variable:
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase anonymous public key

3. Make sure **Production**, **Preview**, and **Development** are all selected for visibility

### Step 3: Deploy

1. Click **"Deploy"**
2. Vercel will build your project and deploy it
3. Once complete, you'll see your live URL (e.g., `https://flowva-reward-page.vercel.app`)

### Step 4: Test Your Live Site

1. Visit your Vercel URL
2. Sign up with a test email
3. Go to Supabase dashboard → SQL Editor and verify the user was created in `auth.users`
4. Test claiming daily reward, logging a win, and redeeming points

**That's it! Your app is live.**

---

## Option 2: Deploy to Netlify

Netlify is another excellent option for static/JAM stack deployments.

### Step 1: Connect GitHub to Netlify

1. Go to [netlify.com](https://app.netlify.com) and click **"Add new site"** → **"Import an existing project"**
2. Select **GitHub** as your Git provider
3. Search for your `Flowva-reward-page` repository and select it
4. Click **"Open configuration file"** or proceed to settings

### Step 2: Configure Build Settings

Netlify should auto-detect these settings, but verify:

- **Build command**: `npm run build`
- **Publish directory**: `dist`

### Step 3: Add Environment Variables

1. Go to **Site Settings** → **Build & Deploy** → **Environment**
2. Click **"Edit variables"**
3. Add your Supabase credentials:
   ```
   VITE_SUPABASE_URL = https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY = your-anon-key
   ```

### Step 4: Deploy

1. Click **"Deploy"** button in Netlify dashboard
2. Wait for the build to complete (takes ~2-3 minutes)
3. Your live URL will be displayed (e.g., `https://flowva-reward.netlify.app`)

### Step 5: Test Your Live Site

Same as Vercel above.

---

## Option 3: Deploy to Other Platforms

The following platforms also work well:

### GitHub Pages
- Limited (static sites only, no server-side auth)
- Not recommended for this project since auth relies on Supabase

### Fly.io
1. Install Fly CLI: `flyctl auth login`
2. Create app: `flyctl launch`
3. Add environment variables: `flyctl secrets set VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=...`
4. Deploy: `flyctl deploy`

### Railway
1. Go to [railway.app](https://railway.app)
2. Click **"Start Project"**
3. Select **GitHub** and import your repository
4. Add environment variables in the dashboard
5. Deploy automatically on Git push

### Heroku
1. Install Heroku CLI: `npm install -g heroku`
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set config: `heroku config:set VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=...`
5. Deploy: `git push heroku main`

---

## Post-Deployment Checklist

After deploying, verify everything works:

- [ ] Website loads without errors
- [ ] Sign up works (check Supabase auth dashboard)
- [ ] Sign in works with new account
- [ ] Can claim daily reward
- [ ] Can log a new reward with points
- [ ] Can toggle reward completion
- [ ] Can delete rewards
- [ ] Can see stats (points, streak, wins)
- [ ] Can redeem an item (if balance >= cost)
- [ ] Can copy referral link
- [ ] Sign out and sign back in (session persists)
- [ ] Check browser console for any errors
- [ ] Test on mobile device

---

## Troubleshooting

### "Supabase not configured" message

**Problem**: You see a warning that Supabase is not configured

**Solution**:
1. Verify environment variables are set in your hosting platform's dashboard
2. Check spelling: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Restart the deployment (on Vercel/Netlify, redeploy with a new commit)
4. Hard refresh your browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

### "Invalid Login Credentials" error

**Problem**: Sign in fails with invalid credentials

**Solution**:
1. Verify the email is correct
2. Check that you actually signed up with that email
3. In Supabase, go to **Authentication** → **Users** to see all accounts
4. If email confirmation is required, check your inbox for confirmation email

### "Already claimed today" error

**Problem**: Can't claim daily reward twice

**Solution**:
- This is expected behavior! Daily rewards reset at midnight UTC
- Try again tomorrow, or check your `daily_claims` table in Supabase to see your claim history

### Points not deducting after redemption

**Problem**: You redeem a reward but points don't change

**Solution**:
1. Refresh the page to reload data from Supabase
2. Check the `redemptions` table in Supabase to verify the record was created
3. Verify the `points_spent` value is correct

### Error "CORS" or "Blocked by CORS"

**Problem**: Browser shows CORS error

**Solution**:
1. This shouldn't happen if Supabase is configured correctly
2. Verify your `VITE_SUPABASE_URL` is correct (should start with `https://`)
3. In Supabase dashboard, go to **Settings** → **API** and confirm URL matches
4. Check that anonymous key is set correctly

---

## Performance Tips

After deployment, optimize performance:

1. **Enable Supabase Edge Functions**: For advanced features like notifications
2. **Set up CDN caching**: Vercel/Netlify do this automatically
3. **Monitor Supabase usage**: Check your project's metrics in Supabase dashboard
4. **Set up error tracking**: Use Sentry or similar service

---

## Next Steps

After successful deployment:

1. **Share the live URL** with the Flowva team (hello@hostinger.com)
2. **Include setup instructions** (see main README.md)
3. **Explain assumptions** (see README.md → Assumptions & Trade-offs)
4. **Document any trade-offs** made during development

---

## Support

If you encounter issues during deployment:

1. Check the deployment logs (Vercel/Netlify dashboard shows build logs)
2. Verify Supabase project is active (not paused)
3. Check that database schema is correctly created
4. Review the browser console for JavaScript errors
5. Check Supabase logs in the dashboard (Logs tab)

Good luck with your deployment! 🚀
