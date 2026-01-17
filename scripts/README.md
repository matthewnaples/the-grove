# Publishing Scripts

## Setup npm Token (One-Time)

To avoid entering 2FA codes every time:

### 1. Create an Automation Token

1. Go to https://www.npmjs.com/settings/yourusername/tokens
2. Click **"Generate New Token"** → **"Classic Token"**
3. Select **"Automation"** (bypasses 2FA)
4. Copy the token

### 2. Add to Your Environment

**Option A: Add to shell config (recommended)**

```bash
# Add to ~/.zshrc or ~/.bashrc
echo 'export NPM_TOKEN="your-token-here"' >> ~/.zshrc
source ~/.zshrc
```

**Option B: Create local .npmrc (per-project)**

```bash
# In the grove-kit root directory
echo "//registry.npmjs.org/:_authToken=YOUR_TOKEN_HERE" > .npmrc
```

⚠️ The `.npmrc` file is gitignored - never commit it!

---

## Publishing a New Version

Once NPM_TOKEN is set:

```bash
npm run publish:all
```

This will:
1. Ask for version bump type (patch/minor/major)
2. Build all packages
3. Generate registry
4. Publish @the-grove/cli
5. Publish the-grove wrapper (with matching version)
6. Commit, tag, and push to GitHub

---

## Manual Publishing (if script fails)

```bash
# CLI
cd packages/cli
npm version patch
npm publish --access public

# Wrapper
cd ../the-grove
npm version patch
npm publish

# Commit
git add .
git commit -m "chore: publish vX.X.X"
git push
```
