#!/bin/bash

set -e

echo "🔗 Setting up local development environment for the-grove..."
echo ""

# Build CLI package
echo "📦 Building @the-grove/cli..."
cd packages/cli
npm run build

# Link CLI globally
echo "🔗 Linking @the-grove/cli..."
npm link

# Link wrapper to use local CLI
echo "🔗 Linking the-grove wrapper..."
cd ../the-grove
npm link @the-grove/cli
npm link --force 2>/dev/null || npm link

cd ../..

echo ""
echo "✅ Local development setup complete!"
echo ""
echo "You can now test with:"
echo "  the-grove add async-button"
echo "  the-grove list"
echo "  the-grove --help"
echo ""
echo "To watch for changes, run in a separate terminal:"
echo "  cd packages/cli && npm run dev"
echo ""
echo "To unlink when done:"
echo "  npm run dev:unlink"
