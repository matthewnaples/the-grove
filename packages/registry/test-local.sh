#!/bin/bash
# Local testing helper script

echo "🧪 Testing registry locally..."
echo ""
echo "Step 1: Building registry..."
npm run build:registry

echo ""
echo "Step 2: Starting HTTP server on port 8080..."
echo "Registry will be available at: http://localhost:8080/r/"
echo ""
echo "To test, open a new terminal and run:"
echo "  cd apps/test-app"
echo "  npx shadcn@latest add http://localhost:8080/r/core/async-button.json --yes"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npx http-server public -p 8080 --cors
