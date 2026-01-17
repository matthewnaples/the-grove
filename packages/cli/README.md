# @the-grove/cli

CLI tool for the-grove component library.

## Usage

### Add components
```bash
npx the-grove add async-button
```

### List components
```bash
npx the-grove list
```

### Contribute components
```bash
npx the-grove contribute ./components/my-component.tsx
```

## Shadcn Compatibility

the-grove registry is fully compatible with shadcn's CLI! You can use either:

**the-grove CLI** (recommended for ease of use):
```bash
npx the-grove add async-button
```

**shadcn CLI** (if you prefer):
```bash
npx shadcn@latest add https://raw.githubusercontent.com/matthewnaples/the-grove/main/packages/registry/registry/core/async-button.json
```

### Why Use the-grove CLI?

- Automatic component discovery (no need to know category)
- Stack detection (warns about missing Convex/Clerk dependencies)
- Browse components with `the-grove list`
- Same reliable installation (uses shadcn under the hood)

## Commands

### add

Add components to your project.

```bash
npx the-grove add <component-name> [options]

Options:
  -p, --path <path>  Custom installation path
  -y, --yes          Skip confirmation prompts
```

### list

List all available components.

```bash
npx the-grove list [options]

Options:
  -c, --category <category>  Filter by category
  -t, --tag <tag>           Filter by tag
```

### contribute

Contribute components back to the-grove.

```bash
npx the-grove contribute <file...>
```

Requires GITHUB_TOKEN environment variable or will prompt for token.

## Development

### Local Testing (Recommended)

From the repository root:

```bash
# Setup local development environment
npm run dev:link

# Test the CLI
the-grove add async-button
the-grove list

# Watch for changes (in separate terminal)
cd packages/cli
npm run dev

# Cleanup when done
cd ../..
npm run dev:unlink
```

### Manual Linking

If you prefer to link manually:

```bash
cd packages/cli

# Build
npm run build

# Link globally
npm link

# Test
the-grove --help

# Unlink when done
npm unlink -g @the-grove/cli
```

### Quick Testing Without Linking

```bash
# From repository root
./scripts/test-local.sh add async-button
```

### Watch Mode

For active development with auto-rebuild on file changes:

```bash
npm run dev
```

This runs tsup in watch mode - any changes to source files will automatically rebuild the dist folder.
