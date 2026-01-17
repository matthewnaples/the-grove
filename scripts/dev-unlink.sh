#!/bin/bash

echo "🔓 Unlinking local development environment..."
echo ""

cd packages/the-grove
npm unlink -g the-grove 2>/dev/null || true
npm unlink @the-grove/cli 2>/dev/null || true

cd ../cli
npm unlink -g @the-grove/cli 2>/dev/null || true

cd ../..

echo "✅ Unlinked successfully!"
echo ""
echo "To use the published version again:"
echo "  npx the-grove@latest --help"
