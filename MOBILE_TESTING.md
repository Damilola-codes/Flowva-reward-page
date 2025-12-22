# Mobile Testing & Database Setup Guide

## 1. Database Table Creation (CRITICAL FIRST STEP)

Your app is showing "Could not find the table 'public.rewards'" errors because the database tables haven't been created yet. Follow these steps:

### Step 1: Log into Supabase
1. Go to [supabase.com](https://supabase.com) and open your FlowvaHub project
2. Navigate to **SQL Editor** (left sidebar → SQL)

### Step 2: Create the Tables
1. Click **New Query** or paste a new SQL block
2. Copy and paste the following SQL:

```sql
-- Drop existing tables if they exist (optional, for clean slate)
DROP TABLE IF EXISTS public.redemptions CASCADE;
DROP TABLE IF EXISTS public.rewards CASCADE;

-- Create rewards table
CREATE TABLE public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  points INTEGER NOT NULL,
  icon TEXT DEFAULT 'gift',
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, title, created_at)
);

-- Create redemptions table
CREATE TABLE public.redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID,
  title TEXT NOT NULL,
  cost INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  redeemed_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row-Level Security)
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for rewards
CREATE POLICY "Users can read their own rewards"
  ON public.rewards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rewards"
  ON public.rewards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rewards"
  ON public.rewards FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rewards"
  ON public.rewards FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for redemptions
CREATE POLICY "Users can read their own redemptions"
  ON public.redemptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own redemptions"
  ON public.redemptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own redemptions"
  ON public.redemptions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own redemptions"
  ON public.redemptions FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_rewards_user_id ON public.rewards(user_id);
CREATE INDEX idx_redemptions_user_id ON public.redemptions(user_id);
```

### Step 3: Execute the Query
1. Click **Run** button (or press Ctrl+Enter)
2. You should see ✅ **Success** messages for each table and policy
3. If you see red error messages, check that:
   - Email confirmations are disabled in Supabase auth (Settings → Auth → Email)
   - Your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are valid

### Step 4: Verify in Supabase
1. Navigate to **Table Editor** (left sidebar → Tables)
2. You should now see two tables: `rewards` and `redemptions`
3. Both should show "RLS is enabled" badge

---

## 2. Mobile Responsiveness Testing

Now that tables are created, test the app on different screen sizes:

### Test Viewports (Use Browser DevTools)

**To open DevTools:**
- Windows/Linux: `F12` or `Ctrl+Shift+I`
- macOS: `Cmd+Option+I`

**Test these sizes:**

| Device | Viewport | Breakpoint |
|--------|----------|-----------|
| iPhone SE | 375×667 | 360–480px |
| iPhone 12 | 390×844 | 480–640px |
| iPad Mini | 768×1024 | 640–1024px |
| Desktop | 1440×900 | 1024px+ |

### Checklist for Each Viewport

✅ **No horizontal scrolling** (scroll bar only appears vertically)
✅ **Text is readable** (h1 at 360px should be ~1rem)
✅ **Buttons are clickable** (min 44×44px touch targets)
✅ **Cards stack vertically** (single column on mobile)
✅ **Padding/gaps look proportional** (not cramped, not too wide)
✅ **Logo visible** (auth page logo should be 70–120px)
✅ **Tabs fit on screen** (Earn/Redeem pills don't overflow)
✅ **Modal fits in viewport** (90% width max, scrollable if needed)

### How to Test in DevTools

1. **Open DevTools** (F12)
2. **Click Device Toolbar** (top-left icon, or Ctrl+Shift+M)
3. **Select a preset device** or choose "Edit" → Add custom size
4. **Resize slowly** and watch for layout breakage
5. **Test at 360px width** especially—this is the smallest common phone

### Known Breakpoints in Your CSS

- **1024px**: Hero becomes single column, stat grid → 1 column
- **768px**: Reduced padding, font sizes scale down
- **640px**: Aggressive padding reduction, all grids → 1 column
- **480px**: Further size reductions, minimal padding
- **360px**: Tiny viewports, maximum compaction

---

## 3. If You See Data Loading Issues

After creating tables:

1. **Refresh the app** in browser (Cmd+R or F5)
2. **Open DevTools Console** (F12 → Console tab)
3. **Look for errors** starting with "PGRST" or "permission"
4. **If still see "Could not find the table":**
   - Check that tables exist in Supabase Table Editor
   - Verify RLS policies are in place
   - Try signing out and back in
5. **If see "permission denied":**
   - Your RLS policies might be wrong
   - Re-run the SQL block to reset them

---

## 4. Running the App Locally

```bash
# Start dev server
npm run dev

# App will be at http://localhost:5173
# Open DevTools to test mobile sizes
```

---

## 5. Common Mobile Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Horizontal scroll on 360px | Container too wide | ✅ Already fixed with `overflow-x: hidden` |
| Text overlaps | Font sizes too large | ✅ Already using clamp() for scaling |
| Buttons unreachable | Too small on mobile | ✅ Already adjusted to 44×44px min |
| Modal covers whole screen | Not responsive | ✅ Already set to 90vw max |
| Gaps too tight | Hard to read | ✅ Already using responsive gaps |

---

## 6. Final Checklist Before Submission

- [ ] Tables created in Supabase (rewards + redemptions)
- [ ] RLS policies enabled on both tables
- [ ] App loads without "Could not find table" errors
- [ ] Sign up/login works
- [ ] Daily +5 claim button works (adds win to rewards)
- [ ] Redeem button works (inserts into redemptions)
- [ ] Tested on 360px, 480px, 768px, 1440px viewports
- [ ] No horizontal scroll on any viewport
- [ ] Text readable, buttons clickable on mobile
- [ ] Logo visible on auth page
- [ ] Error messages show if something breaks

---

**Need help?** See `README.md` for env setup, `DEBUG_GUIDE.md` for common errors, and `FULL_TROUBLESHOOTING.md` for detailed debugging.
