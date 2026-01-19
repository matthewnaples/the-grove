#!/bin/bash

# Grove Publishing Script
# This script publishes both @the-grove/cli and the-grove wrapper with matching versions

set -e  # Exit on error

echo "🌳 Publishing the-grove..."
echo ""

# Get the new version from user
read -p "Enter version bump type (patch/minor/major): " BUMP_TYPE

if [[ ! "$BUMP_TYPE" =~ ^(patch|minor|major)$ ]]; then
  echo "❌ Invalid bump type. Use: patch, minor, or major"
  exit 1
fi

# Check if NPM_TOKEN is set, otherwise ask for OTP
if [[ -n "$NPM_TOKEN" ]]; then
  echo "✅ Using NPM_TOKEN from environment"
  # Configure npm to use the token
  echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc
  PUBLISH_CMD="npm publish --access public"
else
  read -p "Enter your npm 2FA code: " OTP
  if [[ -z "$OTP" ]]; then
    echo "❌ 2FA code is required (or set NPM_TOKEN env var)"
    exit 1
  fi
  PUBLISH_CMD="npm publish --access public --otp=$OTP"
fi

echo ""
echo "📦 Building packages for publishing..."
cd "$(dirname "$0")/.."
npx turbo run build --filter="./packages/*"

echo ""
echo "📝 Building registry (public/r/)..."
npm run generate:registry

echo ""
echo "🔍 Verifying registry build..."
if [ ! -d "packages/registry/public/r/core" ]; then
  echo "❌ Registry build failed - public/r/ directory not found"
  exit 1
fi

# Count component files (excluding index.json)
COMPONENT_COUNT=$(find packages/registry/public/r/core -name "*.json" -not -name "index.json" | wc -l | tr -d ' ')
echo "✅ Registry verified: $COMPONENT_COUNT components built"

echo ""
echo "🔄 Bumping versions..."
cd packages/cli
NEW_VERSION=$(npm version $BUMP_TYPE --no-git-tag-version 2>&1 | grep -o 'v[0-9]*\.[0-9]*\.[0-9]*' | sed 's/v//')
echo "New version: $NEW_VERSION"

cd ../the-grove
# Update the dependency version in package.json
sed -i.bak "s/\"@the-grove\/cli\": \".*\"/\"@the-grove\/cli\": \"^$NEW_VERSION\"/" package.json
rm package.json.bak
# Bump wrapper to same version
npm version $NEW_VERSION --no-git-tag-version --allow-same-version

echo ""
echo "📤 Committing and pushing to GitHub..."
cd ../..
git add .
git commit -m "chore: publish v$NEW_VERSION"
git tag "v$NEW_VERSION"
git push origin main
git push origin "v$NEW_VERSION"

echo ""
echo "⏳ Waiting for GitHub to update (5 seconds)..."
sleep 5

echo ""
echo "✅ Publishing @the-grove/cli..."
cd packages/cli
eval $PUBLISH_CMD

echo ""
echo "✅ Publishing the-grove wrapper..."
cd ../the-grove
eval $PUBLISH_CMD
cd ../..

echo ""
echo "🎉 Successfully published v$NEW_VERSION!"
echo ""
echo "Test with: npx the-grove@latest add async-button"