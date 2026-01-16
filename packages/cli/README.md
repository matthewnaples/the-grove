# @grove-kit/cli

CLI tool for grove-kit component library.

## Usage

### Add components
```bash
npx grove-kit add async-button
```

### List components
```bash
npx grove-kit list
```

### Contribute components
```bash
npx grove-kit contribute ./components/my-component.tsx
```

## Commands

### add

Add components to your project.

```bash
npx grove-kit add <component-name> [options]

Options:
  -p, --path <path>  Custom installation path
  -y, --yes          Skip confirmation prompts
```

### list

List all available components.

```bash
npx grove-kit list [options]

Options:
  -c, --category <category>  Filter by category
  -t, --tag <tag>           Filter by tag
```

### contribute

Contribute components back to grove-kit.

```bash
npx grove-kit contribute <file...>
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
grove-kit --help
```
