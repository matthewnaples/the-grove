# @the-grove/components

React component library for Next.js projects.

## Installation

Via CLI (recommended):
```bash
npx the-grove add async-button
```

Via npm:
```bash
npm install @the-grove/components
```

## Components

### Core
- `async-button` - Button with async loading state

### Convex
- Coming soon...

### Clerk
- Coming soon...

### Full Stack
- Coming soon...

## Usage

```tsx
import { AsyncButton } from '@the-grove/components';

export default function MyComponent() {
  return (
    <AsyncButton
      onClick={async () => {
        await someAsyncOperation();
      }}
    >
      Click me
    </AsyncButton>
  );
}
```

## Development

```bash
# Build
npm run build

# Watch mode
npm run dev
```
