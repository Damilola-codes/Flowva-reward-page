# Quick Reference Card

## Console Errors Explained

### Error: "PGRST205: Could not find the table 'public.rewards'"

**What's happening:**
```
Your App
  ↓ (tries to fetch rewards)
useRewards Hook
  ↓ (queries database)
Supabase
  ↓ (looks for 'rewards' table)
❌ Not Found!
  ↓
Error in Console
```

**Why:**
- Table doesn't exist in Supabase
- You haven't created it yet
- App assumes it exists and tries to query it

**Code location:**
```javascript
// src/hooks/useRewards.js
supabase.from('rewards').select('*')  // ← Fails here
```

**Fix:**
Run SQL to create table (5 minutes)

---

### Error: "PGRST205: Could not find the table 'public.redemptions'"

**Same as above** but for redemptions table.

**Both errors stop once you create both tables.**

---

## Tailwind CSS Now Available

### What Got Added

```bash
npm install -D tailwindcss postcss autoprefixer
```

✅ **tailwind.config.js** — Colors, fonts, spacing  
✅ **postcss.config.js** — CSS processor  
✅ **@tailwind in index.css** — Directives active  

### Responsive Prefixes

```jsx
{/* Base = mobile, sm: = tablet, md: = tablet+, lg: = desktop */}
<div className="p-6 md:p-4 sm:p-2">
  Mobile: 1.5rem padding
  Tablet: 1rem padding  
  Phone: 0.5rem padding
</div>
```

### Breakpoints Ready

| Prefix | Min Width | Device |
|--------|-----------|--------|
| (none) | 0 | Mobile |
| `sm:` | 640px | Tablet |
| `md:` | 768px | Tablet+ |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Large |

### Your Colors Pre-configured

```jsx
bg-primary       {/* #7c3aed Purple */}
bg-secondary     {/* #2563eb Blue */}
bg-accent        {/* #6b21a8 Dark Purple */}
bg-success       {/* #10b981 Green */}
bg-danger        {/* #ef4444 Red */}
bg-info          {/* #0ea5e9 Cyan */}
```

---

## 5-Minute Fix

**Step 1:** Go to Supabase Dashboard  
**Step 2:** SQL Editor → New Query  
**Step 3:** Copy-paste SQL below  
**Step 4:** Click Run  
**Step 5:** Refresh browser  

```sql
CREATE TABLE public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  points INTEGER NOT NULL,
  icon TEXT DEFAULT 'gift',
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  item_id UUID,
  title TEXT NOT NULL,
  cost INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  redeemed_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own rewards"
  ON public.rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own rewards"
  ON public.rewards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own rewards"
  ON public.rewards FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own rewards"
  ON public.rewards FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read their own redemptions"
  ON public.redemptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own redemptions"
  ON public.redemptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own redemptions"
  ON public.redemptions FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own redemptions"
  ON public.redemptions FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_rewards_user_id ON public.rewards(user_id);
CREATE INDEX idx_redemptions_user_id ON public.redemptions(user_id);
```

---

## Files Updated Today

```
✅ NEW:
  tailwind.config.js
  postcss.config.js
  COMPLETE_SUMMARY.md
  TAILWIND_INSTALLED.md
  TAILWIND_SETUP_AND_ERRORS.md
  TAILWIND_AND_ERRORS_VISUAL.md
  TAILWIND_SETUP_TLDR.md

✅ MODIFIED:
  src/index.css (@tailwind directives)
  package.json (dev dependencies)

❌ NOT TOUCHED:
  All .jsx files
  All custom .css files
  All logic/hooks
```

---

## Timeline to Launch

```
NOW        Tailwind installed ✅
NOW        Errors explained ✅
5 min      Create database tables (you do this)
15 min     Test app works
25 min     LAUNCH! 🚀
```

---

## You're This Close! 🎯

```
████████████░░░░░░░░░░░░░░░░░░ 80% done

Just run the SQL and you're set!
```

See **COMPLETE_SUMMARY.md** for full details.  
See **QUICK_START.md** for quick setup.

**Good luck!** 🚀
