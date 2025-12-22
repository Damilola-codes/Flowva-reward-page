# 🔍 Comprehensive Troubleshooting Guide

## Step-by-Step Debugging

### Step 1: Stop Everything and Clean
```bash
# Kill any running node processes
pkill -f "node"
pkill -f "vite"

# Wait 2 seconds
sleep 2

# Navigate to your project
cd /workspaces/Flowva-reward-page

# Remove old cache
rm -rf .vite node_modules/.vite node_modules/.vite-temp dist build 2>/dev/null

# Clear npm cache
npm cache clean --force
```

### Step 2: Fresh Install
```bash
# Remove lock files and node_modules
rm -rf node_modules package-lock.json

# Reinstall everything
npm install

# Verify react-icons is installed
npm list react-icons
# Should show: react-icons@5.0.1
```

### Step 3: Start Dev Server with Verbose Output
```bash
npm run dev -- --host 0.0.0.0 --port 5173
```

You should see output like:
```
  VITE v7.2.4  ready in 456 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### Step 4: Check Browser
1. Open browser to `http://localhost:5173`
2. **Press F12** to open Developer Tools
3. Go to **Console** tab
4. Look for any red error messages

### Step 5: Common Error Messages & Fixes

#### Error: "Cannot find module 'react-icons'"
```bash
npm install react-icons@5.0.1 --save
```

#### Error: "Module not found: AuthForm"
- The file path in import must match exactly: `./components/AuthForm`
- Check file exists: `ls -la src/components/`

#### Error: "Unexpected token"
- Look for unclosed tags or syntax errors
- Check for missing semicolons or brackets

#### Error: "Port 5173 already in use"
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
# or
fuser -k 5173/tcp
```

## Verify All Files Exist

Run these commands:
```bash
# Check main files
ls -la src/App.jsx
ls -la src/main.jsx
ls -la index.html

# Check components
ls -la src/components/AuthForm.jsx
ls -la src/components/RewardPage.jsx
ls -la src/components/RewardCard.jsx

# Check CSS files
ls -la src/App.css
ls -la src/index.css
ls -la src/components/AuthForm.css
ls -la src/components/RewardPage.css
ls -la src/components/RewardCard.css

# Check dependencies
ls -la node_modules/react-icons/
```

All should exist and show file sizes.

## If Still Blank After All Steps

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Copy any error messages you see
4. Go to **Network** tab
5. Check if files like `App.jsx?t=xxx` are loading (should have status 200)
6. Check if they have content in the Response tab

## Test with Minimal Component

If it's still not working, replace `src/App.jsx` with this test:

```jsx
export default function App() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1 style={{ color: '#10b981', fontSize: '2em' }}>
        ✅ React is working!
      </h1>
      <p>If you see this, the app is loading correctly.</p>
    </div>
  )
}
```

If this test works, the issue is in one of your components. If it doesn't work even with this minimal app, there's an environment issue.

## Last Resort: Complete Reset

```bash
# Go to project directory
cd /workspaces/Flowva-reward-page

# Kill all node processes
pkill -9 -f node
pkill -9 -f vite

# Remove everything
rm -rf node_modules package-lock.json .vite dist build

# Reinstall from scratch
npm install

# Start fresh
npm run dev
```

Then visit: http://localhost:5173 in your browser

---

## File Structure Should Be:
```
/workspaces/Flowva-reward-page/
├── src/
│   ├── App.jsx ✓
│   ├── App.css ✓
│   ├── main.jsx ✓
│   ├── index.css ✓
│   └── components/
│       ├── AuthForm.jsx ✓
│       ├── AuthForm.css ✓
│       ├── RewardPage.jsx ✓
│       ├── RewardPage.css ✓
│       ├── RewardCard.jsx ✓
│       └── RewardCard.css ✓
├── index.html ✓
├── vite.config.js ✓
└── package.json ✓
```

All files are in place!
