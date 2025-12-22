#!/bin/bash

# Flowva Reward Page - Quick Start Script

echo "🚀 Starting Flowva Reward Page..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ npm install failed"
        exit 1
    fi
    echo "✅ Dependencies installed"
    echo ""
fi

# Check if react-icons is installed
if ! npm list react-icons > /dev/null 2>&1; then
    echo "📦 Installing react-icons..."
    npm install react-icons@5.0.1
    if [ $? -ne 0 ]; then
        echo "❌ react-icons installation failed"
        exit 1
    fi
    echo "✅ react-icons installed"
    echo ""
fi

echo "🔧 Clearing Vite cache..."
rm -rf .vite node_modules/.vite node_modules/.vite-temp 2>/dev/null

echo "🌐 Starting dev server..."
echo ""
echo "Expected output:"
echo "  VITE vX.X.X ready in XXX ms"
echo "  ➜  Local:   http://localhost:5173/"
echo ""
echo "📝 Open your browser to http://localhost:5173/"
echo "💡 To stop the server, press Ctrl+C"
echo ""

npm run dev
