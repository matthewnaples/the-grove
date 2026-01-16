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

```bash
# Build
npm run build

# Watch mode
npm run dev

# Test locally
npm link
the-grove --help
```
