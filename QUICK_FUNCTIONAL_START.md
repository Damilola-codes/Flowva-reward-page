# 🚀 Quick Start - Functional Features

## ⚡ 2-Minute Setup

### 1. Run Database Setup (REQUIRED)
```
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy all contents from database-setup.sql
4. Paste and click RUN
5. Verify 4 tables created (user_profiles, daily_claims, rewards, redemptions)
```

### 2. Test the App
```
1. Hard refresh browser (Ctrl+Shift+R)
2. Login or signup
3. Go to Daily Focus section
4. Click "Claim +5" button
5. Congratulations modal should appear!
```

---

## ✨ What's Now Functional

### 🔥 Streak System
- **Real-time tracking** of consecutive login days
- **Visual indicators**: Purple = today, Green = completed, Gray = future
- **Auto-resets** if you skip a day
- **Preserves longest streak** even after reset

### 🎁 Daily Rewards
- **+5 points** every day you login
- **Once per day** - duplicate prevention built-in
- **Streak increments** on successful claim
- **Celebration modal** with animations

### 📊 Live Stats
- **Completed Wins**: Total logged achievements
- **Current Streak**: Consecutive days logged in
- **Avg Points/Day**: Average earned per day
- **All real-time** from database

### 🎨 UI Enhancements
- **CongratsModal**: Trophy, particles, progress bar
- **Dynamic hero chips**: Shows your actual streak
- **Week capsules**: Visual progress through the week
- **Loading states**: "Claiming..." feedback
- **Error handling**: "Already claimed today" alerts

---

## 🎯 Quick Test Scenarios

### Test 1: First Claim (30 seconds)
1. Click "Claim +5" → Modal appears
2. Shows "1 Day Streak!"
3. Today's capsule turns purple
4. Balance increases by 5

### Test 2: Try Duplicate (10 seconds)
1. Click "Claim +5" again
2. Alert: "Already claimed today!"
3. No modal, no points

### Test 3: Next Day Claim (24+ hours later)
1. Come back tomorrow
2. Click "Claim +5"
3. Shows "2 Day Streak!"
4. Yesterday turns green, today purple

---

## 🐛 Troubleshooting (30 seconds)

| Problem | Quick Fix |
|---------|-----------|
| "Table not found" error | Run database-setup.sql |
| Modal doesn't show | Hard refresh (Ctrl+Shift+R) |
| Streak shows 0 | Check daily_claims table has records |
| "Already claimed" on first try | Delete test records from daily_claims |

---

## 📂 Files Changed

| File | What Changed |
|------|--------------|
| `database-setup.sql` | Added user_profiles, daily_claims tables |
| `src/hooks/useRewards.js` | Complete rewrite with streak tracking |
| `src/components/CongratsModal.jsx` | NEW - Celebration modal |
| `src/components/CongratsModal.css` | NEW - Modal animations |
| `src/components/RewardPage.jsx` | Integrated real data, modal, claim logic |
| `src/components/RewardPage.css` | Added completed day capsule styles |

---

## 🔍 Key Functions

### calculateStreak(claims)
Walks backward from today, checks consecutive days, returns integer count.

### claimDaily()
Validates not already claimed, inserts records, updates streak, returns `{data, error, streak}`.

### trackLogin()
Updates last_login_date if new day, increments total_logins.

### handleDailyClaim()
UI handler that calls claimDaily(), shows modal with streak result.

---

## 📊 Database Tables

### user_profiles
Tracks: current_streak, longest_streak, last_login_date, total_logins, completed_wins, avg_points_per_day

### daily_claims
Records: claim_date, points_awarded, streak_day  
**UNIQUE(user_id, claim_date)** prevents duplicates

---

## 🎨 Visual States

**Day Capsules:**
- 🟣 Purple = Today (active)
- 🟢 Green = Completed (past day in streak)
- ⚪ Gray = Future or not in streak

**Claim Button:**
- "Claim +5" = Ready to claim
- "Claiming..." = Processing
- Alert = Already claimed today

**Modal:**
- Trophy icon pulses
- 6 particles float upward
- Progress bar fills 0% → 100%
- Shows streak count + points

---

## ✅ Success Checklist

- [ ] Database tables created in Supabase
- [ ] App hard refreshed
- [ ] First claim shows "1 Day Streak!" modal
- [ ] Second claim same day shows "Already claimed" alert
- [ ] Stats grid shows real numbers
- [ ] Week capsules show today as purple
- [ ] Hero chip shows dynamic streak count

---

## 🎯 Next Steps

1. **Test multi-day**: Login every day for a week to see streak build
2. **Test reset**: Skip a day, verify streak resets to 1
3. **Check stats**: Monitor completed wins, avg points/day
4. **Explore code**: Review useRewards.js to understand logic

---

**Full Documentation:** [FUNCTIONAL_FEATURES_GUIDE.md](FUNCTIONAL_FEATURES_GUIDE.md)

**Ready to go! 🚀**
