# Debug Guide for Flowva Reward Page

## Troubleshooting Steps

If you see a blank page in the browser:

### 1. **Kill the Current Dev Server**
```bash
# Press Ctrl+C in the terminal where npm run dev is running
# Or run: pkill -f "vite" or ps aux | grep vite
```

### 2. **Clear Cache & Reinstall**
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### 3. **Start Fresh Dev Server**
```bash
npm run dev
```

### 4. **Check Browser Console**
- Open Developer Tools (F12 or right-click → Inspect)
- Check the **Console** tab for any error messages
- Check the **Network** tab to see if files are loading

### 5. **Expected Output in Terminal**
You should see something like:
```
  VITE v7.2.4  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### 6. **Common Issues & Solutions**

#### Issue: "Cannot find module 'react-icons'"
**Solution**: Run `npm install react-icons@5.0.1`

#### Issue: Port 5173 already in use
**Solution**: Kill the process using that port:
```bash
lsof -ti:5173 | xargs kill -9
```

#### Issue: Still blank page
**Solution**: 
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private window
- Check if JavaScript is enabled
- Look for CORS errors in console

## How to Verify the App is Working

Once the dev server is running:
1. Navigate to `http://localhost:5173`
2. You should see a **green login page** with:
   - Flowva Rewards title
   - Email input field
   - Password input field
   - Sign In / Create Account buttons
3. Try entering test credentials:
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Sign In" to see the rewards dashboard

## If Still Not Working

Check these files exist and have content:
- `src/App.jsx` - Main app component ✓
- `src/components/AuthForm.jsx` - Login form ✓
- `src/components/RewardPage.jsx` - Rewards dashboard ✓
- `src/components/RewardCard.jsx` - Individual reward cards ✓
- `src/App.css` - Main styles ✓
- `src/components/AuthForm.css` - Login styles ✓
- `src/components/RewardPage.css` - Dashboard styles ✓
- `src/components/RewardCard.css` - Card styles ✓
- `src/index.css` - Global styles ✓

All these files are in place and properly configured!
