#!/bin/bash

# EXACT COMMANDS TO RUN IN ORDER
# Copy and paste each section into your terminal

echo "================================"
echo "STEP 1: Kill all processes"
echo "================================"
pkill -9 -f "node"
pkill -9 -f "vite"
echo "✓ Killed all Node processes"
echo ""

echo "================================"
echo "STEP 2: Clean and reinstall"
echo "================================"
cd /workspaces/Flowva-reward-page || exit
rm -rf node_modules package-lock.json .vite dist build node_modules/.vite node_modules/.vite-temp 2>/dev/null
echo "✓ Cleaned old files"
echo ""

echo "================================"
echo "STEP 3: Install dependencies"
echo "================================"
npm install
echo "✓ Dependencies installed"
echo ""

echo "================================"
echo "STEP 4: Verify react-icons"
echo "================================"
npm list react-icons
echo ""

echo "================================"
echo "STEP 5: Start development server"
echo "================================"
echo "🚀 Starting server..."
echo "📝 The server will start on http://localhost:5173"
echo "🎯 Open your browser and go to: http://localhost:5173"
echo ""
npm run dev

# Note: The script will continue running the dev server
# To stop it, press Ctrl+C in the terminal
