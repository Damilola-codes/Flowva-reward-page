# 🚀 Database Setup Guide - Fix Supabase Errors

## ⚠️ Problem
You're seeing these errors:
```
PGRST205: Could not find the table 'public.rewards' in the schema cache
PGRST205: Could not find the table 'public.redemptions' in the schema cache
```

This is because the database tables haven't been created in your Supabase project yet.

---

## ✅ Solution - Create Database Tables

### Step 1: Open Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: **kvpysvmxgfxuofqnueay**

### Step 2: Open SQL Editor
1. Click **"SQL Editor"** in the left sidebar
2. Click **"New query"** button

### Step 3: Run the Setup SQL
1. Open the file `database-setup.sql` in this project
2. **Copy ALL the SQL code** from that file
3. **Paste it** into the Supabase SQL Editor
4. Click **"Run"** button (or press `Ctrl/Cmd + Enter`)

### Step 4: Verify Setup
After running the SQL, verify the tables were created:

1. Click **"Table Editor"** in the left sidebar
2. You should see two new tables:
   - ✅ `rewards`
   - ✅ `redemptions`

### Step 5: Refresh Your App
1. Go back to your application in the browser
2. **Hard refresh** the page: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
3. The errors should be gone! 🎉

---

## 📊 What Was Created

### Tables
- **`rewards`** - Stores user's earned rewards/points
  - Columns: id, user_id, title, description, points, icon, completed, created_at, updated_at
  
- **`redemptions`** - Stores user's reward redemptions
  - Columns: id, user_id, item_id, item_title, points_spent, status, created_at

### Security (RLS Policies)
- ✅ Row Level Security enabled on both tables
- ✅ Users can only see/edit their own data
- ✅ All CRUD operations (Create, Read, Update, Delete) are secured

### Performance
- ✅ Indexes created for fast queries
- ✅ Auto-updating timestamps
- ✅ Optimized for user_id lookups

---

## 🧪 Optional: Add Sample Data

After creating the tables, you can add sample data for testing:

1. In Supabase SQL Editor, run this query to get your user ID:
```sql
SELECT id FROM auth.users LIMIT 1;
```

2. Copy your user ID, then run:
```sql
INSERT INTO public.rewards (user_id, title, description, points, icon, completed) VALUES
('YOUR_USER_ID_HERE', 'Completed daily challenge', 'Finished all tasks for today', 50, 'trophy', true),
('YOUR_USER_ID_HERE', 'Referred a friend', 'Successfully referred John Doe', 100, 'users', true);
```

Replace `YOUR_USER_ID_HERE` with your actual user ID from step 1.

---

## 🔧 Troubleshooting

### Error: "permission denied for table rewards"
**Solution**: Make sure you ran the entire SQL script, including the RLS policies section.

### Error: "relation 'rewards' already exists"
**Solution**: Tables are already created. Just refresh your app.

### Still seeing 404 errors?
1. Go to Supabase Dashboard → Settings → API
2. Verify your Supabase URL and API keys match in `src/lib/supabaseClient.js`
3. Check that you're using the correct project URL

### Tables not showing up?
1. Wait 10-20 seconds after running the SQL
2. Click "Refresh" in the Table Editor
3. Try reloading the Supabase Dashboard page

---

## ✨ You're All Set!

Once the tables are created and the app is refreshed, you should be able to:
- ✅ Add new rewards (Log progress button)
- ✅ View your rewards in the "Recent wins" section
- ✅ Redeem rewards with your points
- ✅ Track your redemption history
- ✅ See your point totals and stats

Happy coding! 🎉
