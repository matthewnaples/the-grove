import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { glob } from 'glob';
import type { RegistryEntry, RegistryFile } from './types.js';
import { extractImports, getComponentCategory, getRelativePath } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const COMPONENTS_DIR = path.resolve(__dirname, '../../components/src');
const REGISTRY_DIR = path.resolve(__dirname, '../registry');

function toTitleCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function generateRegistry() {
  console.log('🔨 Generating registry...\n');

  // Find all component files
  const componentFiles = await glob('**/*.tsx', {
    cwd: COMPONENTS_DIR,
    ignore: ['**/*.test.tsx', '**/*.stories.tsx', 'lib/**'],
  });

  for (const file of componentFiles) {
    const fullPath = path.join(COMPONENTS_DIR, file);
    const content = await fs.readFile(fullPath, 'utf-8');

    const category = getComponentCategory(file);
    const componentName = path.basename(path.dirname(file));

    // Skip if not a main component file (index.tsx or [name].tsx)
    if (!file.endsWith('index.tsx') && !file.includes(componentName)) {
      continue;
    }

    const { registryDeps, npmDeps } = extractImports(content);

    const files: RegistryFile[] = [
      {
        path: `components/ui/${componentName}.tsx`,
        content: content,
        type: 'registry:ui',
      },
    ];

    const registryEntry: RegistryEntry = {
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name: componentName,
      type: 'registry:ui',
      title: toTitleCase(componentName),
      category,
      description: '',
      tags: [],
      registryDependencies: registryDeps,
      dependencies: npmDeps,
      files,
    };

    const outputPath = path.join(REGISTRY_DIR, category, `${componentName}.json`);
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeJson(outputPath, registryEntry, { spaces: 2 });

    console.log(`✓ Generated registry/${category}/${componentName}.json`);
  }

  console.log('\n✅ Registry generation complete!');
}

generateRegistry().catch(console.error);
