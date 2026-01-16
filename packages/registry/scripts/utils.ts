import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
// @ts-ignore - CommonJS/ESM interop issue
const traverseDefault = traverse.default || traverse;
import fs from 'fs-extra';
import path from 'path';
import type { RegistryEntry } from './types.js';

export function extractImports(code: string): {
  registryDeps: string[];
  npmDeps: string[];
} {
  const registryDeps = new Set<string>();
  const npmDeps = new Set<string>();

  try {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    });

    traverseDefault(ast, {
      ImportDeclaration(path: any) {
        const source = path.node.source.value;

        // Registry dependencies (from @grove-kit/components or @/components)
        if (
          source.startsWith('@grove-kit/components/') ||
          source.startsWith('@/components/')
        ) {
          const parts = source.split('/');
          const componentName = parts[parts.length - 1];
          registryDeps.add(componentName);
        }
        // npm dependencies
        else if (!source.startsWith('.') && !source.startsWith('@/')) {
          const packageName = source.startsWith('@')
            ? source.split('/').slice(0, 2).join('/')
            : source.split('/')[0];

          // Filter out React core (always present)
          if (!['react', 'react-dom', 'next'].includes(packageName)) {
            npmDeps.add(packageName);
          }
        }
      },
    });
  } catch (error) {
    console.warn(`Failed to parse file: ${error}`);
  }

  return {
    registryDeps: Array.from(registryDeps),
    npmDeps: Array.from(npmDeps),
  };
}

export function getComponentCategory(filePath: string): RegistryEntry['category'] {
  if (filePath.includes('/core/')) return 'core';
  if (filePath.includes('/convex-clerk/')) return 'convex-clerk';
  if (filePath.includes('/convex/')) return 'convex';
  if (filePath.includes('/clerk/')) return 'clerk';
  return 'core';
}

export function getRelativePath(filePath: string): string {
  // Convert absolute path to registry-relative path
  // packages/components/src/core/async-button/index.tsx
  // -> components/core/async-button/index.tsx
  const match = filePath.match(/src\/(.+)/);
  return match ? `components/${match[1]}` : filePath;
}
