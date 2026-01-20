<div align="center">

![the-grove](.github/assets/header.png)


# Welcome To The Grove

*Like a grove where carefully tended trees grow in harmony, the-grove cultivates a collection of thoughtfully crafted components. Each one nurtured, tested, and ready to flourish in your Next.js garden. Plant them with a single command, watch them bloom.*

</div>

---

## Prerequisites

The Grove components extend [shadcn/ui](https://ui.shadcn.com) components. You need to initialize shadcn in your project first:

```bash
npx shadcn@latest init
```

This sets up:
- Tailwind CSS configuration
- Global styles and CSS variables
- Path aliases for clean imports
- Base components (button, card, etc.)

## Quick Start

Install components:
```bash
npx the-grove add async-button
```

List available components:
```bash
npx the-grove list
```

**Note:** If a component depends on a shadcn component you don't have (like `button`), install it separately:
```bash
npx shadcn@latest add button
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

### Method 3: Via components.json

Add the-grove as a registry in your `components.json`:

```json
{
  "registries": {
    "@grove": "https://raw.githubusercontent.com/matthewnaples/the-grove/main/packages/registry/registry/core/{name}.json"
  }
}
```

Then install with:
```bash
npx shadcn@latest add @grove/async-button
```

**Note:** Currently supports core components. For other categories (convex, clerk), use Method 1 or 2.

## Packages

- `@the-grove/cli` - CLI tool (published to npm)
- `@the-grove/registry` - Registry generator and component source (internal)
- `@the-grove/playground` - Development playground (internal)

## Local Development

### Quick Start

1. **Clone and install:**
   ```bash
   git clone https://github.com/matthewnaples/the-grove.git
   cd the-grove
   npm install
   ```

2. **Link for local testing:**
   ```bash
   npm run dev:link
   ```

3. **Test your changes:**
   ```bash
   the-grove add async-button
   the-grove list
   ```

4. **Watch mode (optional):**
   In a separate terminal, run:
   ```bash
   cd packages/cli
   npm run dev
   ```

   Now any changes to the CLI source will automatically rebuild.

5. **Unlink when done:**
   ```bash
   npm run dev:unlink
   ```

### Development Workflow

#### Making CLI Changes

1. Edit files in `packages/cli/src/`
2. If you're not in watch mode, rebuild: `cd packages/cli && npm run build`
3. Test immediately: `the-grove <your-command>`
4. Iterate quickly without publishing!

#### Making Registry Changes

1. Edit components in `packages/registry/registry/the-grove/`
2. Update `packages/registry/registry.json` with component metadata
3. Regenerate registry: `npm run generate:registry`
4. Test with your local CLI: `the-grove add <component>`

#### Testing Component Installation

Use the test Next.js app to verify components install correctly:

```bash
cd apps/test-app
the-grove add async-button  # Installs to test app
npm run dev                 # See component in action (optional)
```

The test app is pre-configured with:
- Next.js 15 + TypeScript + Tailwind
- shadcn theme and `components.json`
- Path aliases for clean imports

See `apps/test-app/README.md` for more details.

#### Quick Test Script

For rapid testing without linking globally:

```bash
# Test a command directly
./scripts/test-local.sh add async-button
./scripts/test-local.sh list
```

### Other Development Commands

```bash
# Run playground
npm run dev:playground

# Build all packages
npm run build

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
