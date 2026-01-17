<div align="center">

![the-grove](.github/assets/header.png)


# Welcome To The Grove

*Like a grove where carefully tended trees grow in harmony, the-grove cultivates a collection of thoughtfully crafted components. Each one nurtured, tested, and ready to flourish in your Next.js garden. Plant them with a single command, watch them bloom.*

</div>

---

## Quick Start

Install components:
```bash
npx the-grove add async-button
```

List available components:
```bash
npx the-grove list
```

## Installation Methods

### Method 1: Using the-grove CLI (Recommended)

Easiest way with automatic component discovery:

```bash
npx the-grove add async-button
```

The CLI will:
- Find the component across all categories
- Warn about missing dependencies (Convex, Clerk, etc.)
- Use shadcn to install with proper overwrite protection

### Method 2: Using shadcn CLI Directly

If you prefer using shadcn directly:

```bash
npx shadcn@latest add https://raw.githubusercontent.com/matthewnaples/the-grove/main/packages/registry/registry/core/async-button.json
```

**Note:** You'll need to know the component's category (core, convex, clerk, convex-clerk).

### Method 3: Via components.json (Future)

Coming soon: Add the-grove as a registry in your `components.json`:

```json
{
  "registries": {
    "@grove": "https://raw.githubusercontent.com/matthewnaples/the-grove/main/packages/registry/registry"
  }
}
```

Then install with:
```bash
npx shadcn@latest add @grove/async-button
```

## Packages

- `@the-grove/cli` - CLI tool (published to npm)
- `@the-grove/components` - Component library (published to npm)
- `@the-grove/registry` - Registry generator (internal)
- `@the-grove/playground` - Development playground (internal)

## Development

```bash
# Install dependencies
npm install

# Run playground
npm run dev:playground

# Build all packages
npm run build

# Generate registry
npm run generate:registry

# Validate registry
npm run validate:registry
```

## Contributing Components

```bash
npx the-grove contribute ./components/my-component.tsx
```

## Project Structure

```
the-grove/
├── packages/
│   ├── components/    # React components
│   ├── cli/          # CLI tool
│   └── registry/     # Registry generator
└── apps/
    └── playground/   # Component playground
```

## Available Components

### Core
- `async-button` - Button with async loading state

### Convex
- Coming soon...

### Clerk
- Coming soon...

### Full Stack (Convex + Clerk)
- Coming soon...

## Publishing

Before publishing, update the GitHub username in:
- `packages/cli/src/commands/add.ts` (REGISTRY_BASE_URL)
- `packages/cli/src/commands/contribute.ts` (TEMPLATE_REPO)
- `packages/cli/src/commands/list.ts` (REGISTRY_BASE_URL)

Then:
```bash
cd packages/cli
npm publish --access public
```

## License

MIT
