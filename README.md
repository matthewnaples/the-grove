# grove-kit

Component library with CLI for Next.js projects.

## Quick Start

Install components:
```bash
npx grove-kit add async-button
```

List available components:
```bash
npx grove-kit list
```

## Packages

- `@grove-kit/cli` - CLI tool (published to npm)
- `@grove-kit/components` - Component library (published to npm)
- `@grove-kit/registry` - Registry generator (internal)
- `@grove-kit/playground` - Development playground (internal)

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
npx grove-kit contribute ./components/my-component.tsx
```

## Project Structure

```
grove-kit/
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
