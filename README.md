# Flowva Rewards Platform

A full-stack React + Supabase rewards management system that recreates the FlowvaHub rewards experience. Users can earn points through daily check-ins and logged wins, track streaks, and redeem rewards.

## 🎯 Features

- **Authentication**: Secure email/password auth via Supabase
- **Earn Points**: Log daily focus wins and track streaks
- **Daily Claims**: Claim +5 points daily with streak tracking
- **Referral System**: Share referral links to invite teammates
- **Redemptions**: Redeem points for gift cards, team credits, and more
- **Real-time Stats**: Points balance, completion count, streaks, and daily averages
- **Responsive UI**: Mobile-first design with Tailwind CSS
- **Error Handling**: Loading states, empty states, and comprehensive error messages

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS + PostCSS
- **Icons**: react-icons
- **Backend & Database**: Supabase (PostgreSQL + Auth)
- **Security**: Row-Level Security (RLS) policies

## 📋 Prerequisites

- Node.js 18+ and npm
- A [Supabase account](https://supabase.com) (free tier works great)
- Git

## 🚀 Quick Start

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd Flowva-reward-page
npm install
```

### 2. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key (found in Settings → API)

### 3. Configure Environment

Create `.env` in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set Up Database Schema

Open your Supabase project → SQL Editor and run the complete SQL script below:

```sql
-- ============================================================================
-- ENABLE REQUIRED EXTENSIONS
-- ============================================================================
create extension if not exists "uuid-ossp";

-- ============================================================================
-- USER PROFILES TABLE
-- ============================================================================
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  signup_date timestamptz default now(),
  last_login_date date,
  last_claim_date date,
  current_streak integer default 0,
  longest_streak integer default 0,
  completed_wins integer default 0,
  avg_points_per_day numeric default 0,
  total_logins integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_profiles enable row level security;

create policy "users_read_own_profile" on public.user_profiles
  for select using (auth.uid() = id);

create policy "users_update_own_profile" on public.user_profiles
  for update using (auth.uid() = id);

create policy "users_insert_own_profile" on public.user_profiles
  for insert with check (auth.uid() = id);

-- ============================================================================
-- REWARDS TABLE - For logged wins/achievements
-- ============================================================================
create table if not exists public.rewards (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  points integer not null default 0,
  completed boolean default false,
  icon text default 'star',
  date date default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_rewards_user_id on public.rewards(user_id);
create index idx_rewards_created_at on public.rewards(created_at);

alter table public.rewards enable row level security;

create policy "rewards_select_own" on public.rewards
  for select using (auth.uid() = user_id);

create policy "rewards_insert_own" on public.rewards
  for insert with check (auth.uid() = user_id);

create policy "rewards_update_own" on public.rewards
  for update using (auth.uid() = user_id);

create policy "rewards_delete_own" on public.rewards
  for delete using (auth.uid() = user_id);

-- ============================================================================
-- DAILY CLAIMS TABLE - For tracking daily streaks
-- ============================================================================
create table if not exists public.daily_claims (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  claim_date date not null,
  points_awarded integer default 5,
  streak_day integer default 1,
  created_at timestamptz default now()
);

create index idx_daily_claims_user_id on public.daily_claims(user_id);
create index idx_daily_claims_claim_date on public.daily_claims(claim_date);

alter table public.daily_claims enable row level security;

create policy "daily_claims_select_own" on public.daily_claims
  for select using (auth.uid() = user_id);

create policy "daily_claims_insert_own" on public.daily_claims
  for insert with check (auth.uid() = user_id);

-- ============================================================================
-- REDEMPTIONS TABLE - For tracking point redemptions
-- ============================================================================
create table if not exists public.redemptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null,
  item_title text not null,
  points_spent integer not null,
  status text default 'completed',
  created_at timestamptz default now()
);

create index idx_redemptions_user_id on public.redemptions(user_id);
create index idx_redemptions_created_at on public.redemptions(created_at);

alter table public.redemptions enable row level security;

create policy "redemptions_select_own" on public.redemptions
  for select using (auth.uid() = user_id);

create policy "redemptions_insert_own" on public.redemptions
  for insert with check (auth.uid() = user_id);

create policy "redemptions_update_own" on public.redemptions
  for update using (auth.uid() = user_id);
```

### 5. Run Locally

```bash
npm run dev
```

Visit `http://localhost:5173` and sign up for a new account.

## 📦 Project Structure

```
src/
├── components/
│   ├── AuthForm.jsx         # Login/signup UI
│   ├── RewardPage.jsx       # Main rewards dashboard
│   ├── RewardCard.jsx       # Individual reward card
│   ├── CongratsModal.jsx    # Daily claim celebration modal
│   └── *.css                # Component styles
├── contexts/
│   └── AuthContext.jsx      # Auth state management
├── hooks/
│   └── useRewards.js        # Rewards logic & Supabase queries
├── lib/
│   └── supabaseClient.js    # Supabase initialization
├── App.jsx                  # Root component
└── main.jsx                 # Entry point
```

## 🔑 Key Functionality

### Authentication
- Users sign up with email/password (Supabase Auth)
- Passwords are securely hashed on Supabase servers
- Session persists across browser refreshes

### Earning Points
1. **Daily Focus**: Claim +5 points daily (resets at midnight UTC)
2. **Log Wins**: Manually log achievements with custom points
3. **Referrals**: Earn 25 points per successful referral

### Redemptions
- Display unlocked/locked/coming-soon rewards based on point balance
- Deduct points when a reward is claimed
- Track redemption history

### Streaks & Stats
- Daily streak counter (resets if a day is skipped)
- Total completed wins count
- Average points per day since signup
- Loading and error states throughout

## 🔐 Security & Data Privacy

- **Row-Level Security**: Users can only access their own data via RLS policies
- **No Passwords Stored Locally**: Handled entirely by Supabase
- **Environment Variables**: Sensitive keys are never exposed in code

## 📱 Responsive Design

- Mobile-first approach
- Fully responsive on phones, tablets, and desktops
- Built with Tailwind CSS for consistent styling

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel dashboard:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
4. Deploy with one click

### Deploy to Netlify

1. Connect your GitHub repo to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add the same environment variables in Netlify dashboard
5. Deploy

### Deploy to Other Platforms

Any platform that supports Node.js/static sites works:
- GitHub Pages (with modifications)
- Fly.io
- Railway
- Heroku
- etc.

## 🎨 Customization

### Redeemable Items

Edit `src/components/RewardPage.jsx` → `redeemables` array to add/remove reward options.

### Reward Icons

The app supports these icons (from react-icons):
`star`, `trophy`, `fire`, `heart`, `code`, `palette`, `music`, `lightbulb`, `running`, `book`

Add more by importing from `react-icons/fa` and updating the `rewardIcons` object.

### Colors & Styling

- Tailwind config: [tailwind.config.js](tailwind.config.js)
- Component CSS: `src/components/*.css`
- Global styles: [src/index.css](src/index.css)

## ⚙️ Assumptions & Trade-offs

### Assumptions
1. **Email Verification**: By default, Supabase requires email confirmation. You can disable this in Supabase Auth settings → "Confirmations" if testing locally.
2. **Streak Resets at Midnight UTC**: Daily streaks reset at 00:00 UTC, not user's local timezone.
3. **Points Are Permanent**: Once redeemed, points are deducted from the balance. Redemptions cannot be reversed without manual intervention.

### Trade-offs
1. **No Real Payment Processing**: Redemptions are tracked but don't trigger actual shipment. In production, integrate with payment/fulfillment services.
2. **Referral Tracking**: Referral count is hardcoded to 0. Implement a `referrals` table to track actual invites.
3. **No Notifications**: Users are not notified of streak breaks or reward unlocks via email. Could be added with Supabase Edge Functions + SendGrid.
4. **Streak Logic**: Simple day-based streaks. Advanced logic (e.g., timezone awareness, partial days) not implemented.

## 📊 Performance

- Vite provides fast build times and optimized bundle sizes
- Supabase queries are indexed for fast lookups
- React components use proper memoization where needed
- CSS is minified in production builds

## 🐛 Testing

### Manual Test Checklist
- [ ] Sign up with new email
- [ ] Sign in with existing account
- [ ] Claim daily reward (should show streak)
- [ ] Log a custom reward with points
- [ ] Toggle reward completion
- [ ] Delete a reward
- [ ] View stats (completed wins, streak, avg points)
- [ ] Redeem a reward (if balance >= cost)
- [ ] Try to redeem locked reward (should be disabled)
- [ ] Copy referral link
- [ ] Sign out and sign back in
- [ ] Verify data persists across sessions

## 📞 Support & Issues

If you encounter issues:
1. Check that `.env` has correct Supabase keys
2. Ensure Supabase project is active (not paused)
3. Verify database schema is created (check Supabase SQL Editor)
4. Check browser console for errors
5. Test Supabase connectivity with the Supabase dashboard

## 📄 License

This project is provided as-is for the Flowva technical assessment.

---

**Built with ❤️ for Flowva Rewards**
