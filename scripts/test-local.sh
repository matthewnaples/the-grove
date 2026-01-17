#!/bin/bash

# Quick test script for local development
# Usage: ./scripts/test-local.sh add async-button

set -e

echo "🔨 Building CLI..."
cd packages/cli
npm run build > /dev/null 2>&1

echo "🧪 Testing: the-grove $@"
echo ""

# Run the command
node dist/index.js "$@"
