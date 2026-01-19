# The Grove Registry

The component registry for The Grove - a collection of reusable React components for Next.js applications.

## Structure

```
packages/registry/
├── registry.json           # Source of truth: component metadata definitions
├── src/                    # Component source files organized by category
│   ├── core/              # Framework-agnostic components
│   ├── convex/            # Convex-specific components
│   ├── clerk/             # Clerk-specific components
│   └── convex-clerk/      # Components requiring both Convex and Clerk
├── public/r/              # Built registry files (generated, do not edit)
│   ├── core/
│   │   ├── async-button.json
│   │   ├── loading-spinner.json
│   │   └── index.json
│   └── index.json
└── scripts/
    ├── build.ts           # Registry build script
    └── types.ts           # TypeScript type definitions
```

## How It Works

### Source Definition

The `registry.json` file is the **single source of truth** for all component metadata:

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "the-grove",
  "homepage": "https://github.com/matthewnaples/the-grove",
  "items": [
    {
      "name": "async-button",
      "type": "registry:ui",
      "title": "Async Button",
      "description": "Button with built-in async state handling",
      "category": "core",
      "registryDependencies": ["button"],
      "dependencies": ["lucide-react"],
      "files": [
        {
          "path": "src/core/async-button/async-button.tsx",
          "type": "registry:ui"
        }
      ]
    }
  ]
}
```

### Build Process

1. The build script reads `registry.json`
2. Reads component source files from `src/` directory
3. Embeds file content into JSON files
4. Generates individual component files in `public/r/{category}/{name}.json`
5. Generates category index files for the CLI `list` command
6. Generates top-level registry index

Run the build:

```bash
npm run build:registry
```

### Distribution

Built registry files are committed to Git and served via GitHub raw URLs:

```
https://raw.githubusercontent.com/matthewnaples/the-grove/main/packages/registry/public/r/core/async-button.json
```

### Installation

Users install components via the grove CLI:

```bash
npx the-grove add async-button
```

The CLI delegates to `shadcn add <registry-url>` which handles the actual installation.

## Adding a New Component

1. **Create the component source file:**
   ```bash
   mkdir -p src/core/my-component
   # Create src/core/my-component/my-component.tsx
   ```

2. **Add entry to `registry.json`:**
   ```json
   {
     "name": "my-component",
     "type": "registry:ui",
     "title": "My Component",
     "description": "Description of what it does",
     "category": "core",
     "registryDependencies": [],
     "dependencies": [],
     "files": [
       {
         "path": "src/core/my-component/my-component.tsx",
         "type": "registry:ui"
       }
     ]
   }
   ```

3. **Build the registry:**
   ```bash
   npm run build:registry
   ```

4. **Commit both source and built files:**
   ```bash
   git add registry.json src/ public/
   git commit -m "Add my-component"
   ```

## Categories

- **core** - Framework-agnostic UI components (async-button, loading-spinner)
- **convex** - Components for Convex integration
- **clerk** - Components for Clerk authentication
- **convex-clerk** - Components requiring both Convex and Clerk

## Schema Compliance

All registry files follow the official shadcn registry schema:
- https://ui.shadcn.com/schema/registry.json
- https://ui.shadcn.com/schema/registry-item.json

## Development

### Build TypeScript Scripts

```bash
npm run build
```

### Build Registry

```bash
npm run build:registry
# or
npm run generate  # alias
```

### Validate Registry

```bash
npm run validate
```

### Test Locally

Since `shadcn add` doesn't support `file://` URLs, you need to serve the registry locally:

**Quick test script:**
```bash
./test-local.sh
```

**Manual testing:**

Terminal 1 - Start registry server:
```bash
npm run serve
# Registry available at http://localhost:8080/r/
```

Terminal 2 - Test installation:
```bash
cd ../../apps/test-app
npx shadcn@latest add http://localhost:8080/r/core/async-button.json --yes
```

**Test with the-grove CLI:**
1. Temporarily change `REGISTRY_BASE_URL` in `packages/cli/src/commands/add.ts` to `http://localhost:8080/r`
2. Build CLI: `cd packages/cli && npm run build`
3. Test: `cd apps/test-app && npx the-grove add async-button`
4. Remember to revert the URL change before committing!

## Key Features

- **Explicit metadata**: No auto-scanning or import parsing
- **Category organization**: Components organized by integration type
- **shadcn compatible**: Works seamlessly with shadcn CLI
- **Extensible**: Easy to add grove-specific features and metadata
