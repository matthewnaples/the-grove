# The Grove Registry

The component registry for The Grove - a collection of reusable React components for Next.js applications with Convex and Clerk integration.

## Structure

```
packages/registry/
├── registry.json              # Source of truth: component metadata definitions
├── app/                       # Next.js app for developing and testing components
│   ├── layout.tsx
│   ├── page.tsx              # Component showcase/demo page
│   └── globals.css
├── registry/the-grove/        # Component source files
│   ├── async-button/
│   │   └── async-button.tsx
│   ├── loading-spinner/
│   │   └── loading-spinner.tsx
│   └── ui/                   # Shadcn primitives installed here
│       └── button.tsx
├── lib/
│   └── utils.ts              # Utility functions (cn, etc.)
├── public/r/                  # Built registry files (generated, do not edit)
│   ├── core/                 # Category-organized output
│   │   ├── async-button.json
│   │   ├── loading-spinner.json
│   │   └── index.json
│   ├── async-button.json     # Flat files (shadcn build output)
│   ├── loading-spinner.json
│   └── index.json            # Top-level registry index
├── scripts/
│   ├── organize-by-category.ts  # Post-processes shadcn build output
│   └── types.ts
├── components.json            # Shadcn CLI configuration
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## How It Works

### Component Development

This registry package is a **Next.js application** where components are developed as actual TypeScript files with full IDE support and type checking.

#### Key Features:
- **Full TypeScript support**: All components in `registry/the-grove/` are type-checked
- **Path aliases**: Use `@/` imports that resolve correctly (e.g., `@/lib/utils`)
- **Live development**: Run `npm run dev` to develop components with hot reload
- **Visual testing**: Components displayed in `app/page.tsx` for immediate visual feedback

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
          "path": "registry/the-grove/async-button/async-button.tsx",
          "type": "registry:ui"
        }
      ]
    }
  ]
}
```

### Build Process

The build uses the official `shadcn build` command, then post-processes for category organization:

1. `shadcn build` reads `registry.json` and embeds file content into JSON
2. Generates flat JSON files in `public/r/` (e.g., `async-button.json`)
3. `organize-by-category.ts` reorganizes into category directories
4. Generates category index files for the CLI `list` command

Run the build:

```bash
npm run generate
# or
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

## Development Workflow

### Setting Up

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the dev server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 to see components in action

### Adding a New Component

#### 1. Install Required Shadcn Primitives

If your component depends on shadcn primitives (like Button, Input, etc.), install them first:

```bash
npx shadcn@latest add button
```

This installs the primitive to `registry/the-grove/ui/button.tsx` where your components can import it.

#### 2. Create the Component

Create your component file:

```bash
mkdir -p registry/the-grove/my-component
```

Create `registry/the-grove/my-component/my-component.tsx`:

```typescript
'use client';

import { Button } from '@/registry/the-grove/ui/button';
import { cn } from '@/lib/utils';

export interface MyComponentProps {
  // ...
}

export function MyComponent({ ...props }: MyComponentProps) {
  return (
    <Button>Click me</Button>
  );
}
```

**Important**: Import shadcn primitives from `@/registry/the-grove/ui/[component]`, not `@/components/ui/[component]`.

#### 3. Add to Demo Page

Update `app/page.tsx` to showcase your component:

```typescript
import { MyComponent } from "@/registry/the-grove/my-component/my-component";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
      {/* ... existing components ... */}

      <div className="flex flex-col gap-4 border rounded-lg p-4">
        <h2 className="text-sm text-muted-foreground">My Component</h2>
        <div className="flex items-center justify-center min-h-[150px]">
          <MyComponent />
        </div>
      </div>
    </div>
  );
}
```

#### 4. Test with Hot Reload

Your component will hot reload as you make changes. Verify:
- No TypeScript errors in your IDE
- Component renders correctly at http://localhost:3000
- All imports resolve properly

#### 5. Add to registry.json

```json
{
  "name": "my-component",
  "type": "registry:ui",
  "title": "My Component",
  "description": "Description of what it does",
  "category": "core",
  "registryDependencies": ["button"],
  "dependencies": [],
  "files": [
    {
      "path": "registry/the-grove/my-component/my-component.tsx",
      "type": "registry:ui"
    }
  ]
}
```

#### 6. Build the Registry

```bash
npm run generate
```

This creates the JSON files in `public/r/core/my-component.json`.

#### 7. Commit Everything

```bash
git add registry.json registry/the-grove/ app/page.tsx public/r/
git commit -m "Add my-component"
```

## Categories

- **core** - Framework-agnostic UI components (async-button, loading-spinner)
- **convex** - Components for Convex integration
- **clerk** - Components for Clerk authentication
- **convex-clerk** - Components requiring both Convex and Clerk

## Path Aliases

The project uses TypeScript path aliases configured in `tsconfig.json`:

- `@/` → Root directory
- `@/registry/the-grove/ui/button` → Shadcn primitives
- `@/lib/utils` → Utility functions
- `@/registry/the-grove/my-component/my-component` → Grove components

Always use these aliases in your components for consistency.

## Scripts

### Development
```bash
npm run dev        # Start Next.js dev server
npm run build      # Build Next.js app
npm run start      # Start production server
```

### Registry Build
```bash
npm run generate         # Build the registry (recommended)
npm run build:registry   # Same as generate
npm run build:ts         # Compile TypeScript scripts only
```

### Testing
```bash
npm run serve      # Serve registry files locally on :8080
```

## Testing Locally

Since `shadcn add` doesn't support `file://` URLs, you need to serve the registry locally:

**Terminal 1** - Start registry server:
```bash
npm run serve
# Registry available at http://localhost:8080/r/
```

**Terminal 2** - Test installation in a Next.js project:
```bash
cd ../../apps/test-app  # or any Next.js project
npx shadcn@latest add http://localhost:8080/r/core/async-button.json --yes
```

**Test with the-grove CLI:**
1. Temporarily change `REGISTRY_BASE_URL` in `packages/cli/src/commands/add.ts` to `http://localhost:8080/r`
2. Build CLI: `cd packages/cli && npm run build`
3. Test: `cd apps/test-app && npx the-grove add async-button`
4. Remember to revert the URL change before committing!

## TypeScript Configuration

The project uses two TypeScript configurations:

- **tsconfig.json** - Main config for Next.js app and components (includes all .ts/.tsx files)
- **tsconfig.scripts.json** - Separate config for build scripts (ES modules, outputs to `dist/`)

This separation ensures:
- Components get full Next.js TypeScript support
- Build scripts compile independently with proper ES module support
- No conflicts between app code and build tooling

## Shadcn Configuration

The `components.json` file configures the shadcn CLI:

```json
{
  "style": "new-york",
  "aliases": {
    "ui": "@/registry/the-grove/ui"
  }
}
```

When you run `npx shadcn@latest add button`, it installs to `registry/the-grove/ui/button.tsx`.

## Schema Compliance

All registry files follow the official shadcn registry schema:
- https://ui.shadcn.com/schema/registry.json
- https://ui.shadcn.com/schema/registry-item.json

## Key Design Principles

- **Real TypeScript files**: Components are actual .tsx files with full IDE support, not just embedded strings
- **Next.js development**: Develop components in a real Next.js app with hot reload
- **Shadcn compatible**: Uses official `shadcn build` command for maximum compatibility
- **Category organization**: Post-processing maintains grove's category-based URL structure
- **Explicit metadata**: No auto-scanning; registry.json is the single source of truth
