import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import type { Registry, RegistryEntry, RegistryFile } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REGISTRY_ROOT = path.resolve(__dirname, '..');
const REGISTRY_JSON_PATH = path.join(REGISTRY_ROOT, 'registry.json');
const SRC_DIR = path.join(REGISTRY_ROOT, 'registry/the-grove');
const OUTPUT_DIR = path.join(REGISTRY_ROOT, 'public/r');

async function buildRegistry() {
  console.log('🔨 Building registry from registry.json...\n');

  // Read the source registry definition
  const sourceRegistry: Registry = await fs.readJson(REGISTRY_JSON_PATH);

  // Track components by category for index generation
  const componentsByCategory: Record<string, any[]> = {
    core: [],
    convex: [],
    clerk: [],
    'convex-clerk': [],
  };

  // Track all registry entries for top-level index
  const allRegistryEntries: RegistryEntry[] = [];

  // Process each component in the registry
  for (const item of sourceRegistry.items) {
    const category = item.category;

    console.log(`📦 Processing ${item.name} (${category})...`);

    // Read file content for each file in the component
    const filesWithContent: RegistryFile[] = [];

    for (const file of item.files) {
      const filePath = path.join(REGISTRY_ROOT, file.path);

      if (!await fs.pathExists(filePath)) {
        console.error(`  ❌ File not found: ${file.path}`);
        throw new Error(`Component file not found: ${filePath}`);
      }

      const content = await fs.readFile(filePath, 'utf-8');

      filesWithContent.push({
        path: file.path,
        content: content,
        type: file.type,
      });

      console.log(`  ✓ Read ${file.path}`);
    }

    // Create the full registry entry with embedded content
    const registryEntry: RegistryEntry = {
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name: item.name,
      type: item.type,
      title: item.title,
      category: item.category,
      description: item.description,
      tags: item.tags,
      registryDependencies: item.registryDependencies,
      dependencies: item.dependencies,
      files: filesWithContent,
    };

    // Write individual component JSON file
    const outputPath = path.join(OUTPUT_DIR, category, `${item.name}.json`);
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeJson(outputPath, registryEntry, { spaces: 2 });
    console.log(`  ✓ Generated public/r/${category}/${item.name}.json\n`);

    // Add to all entries array
    allRegistryEntries.push(registryEntry);

    // Add to category index (without file content to keep index lightweight)
    componentsByCategory[category].push({
      name: item.name,
      title: item.title,
      description: item.description,
      tags: item.tags,
      dependencies: item.dependencies,
      registryDependencies: item.registryDependencies,
    });
  }

  // Generate index.json for each category
  console.log('📝 Generating category indexes...');
  for (const [category, components] of Object.entries(componentsByCategory)) {
    const indexPath = path.join(OUTPUT_DIR, category, 'index.json');
    await fs.ensureDir(path.dirname(indexPath));
    await fs.writeJson(indexPath, components, { spaces: 2 });
    console.log(`  ✓ Generated public/r/${category}/index.json (${components.length} components)`);
  }

  // Generate top-level registry index
  console.log('\n📝 Generating top-level index...');
  const topLevelRegistry: Registry = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: sourceRegistry.name,
    homepage: sourceRegistry.homepage,
    items: allRegistryEntries,
  };

  const registryIndexPath = path.join(OUTPUT_DIR, 'index.json');
  await fs.writeJson(registryIndexPath, topLevelRegistry, { spaces: 2 });
  console.log(`  ✓ Generated public/r/index.json (${allRegistryEntries.length} total components)`);

  console.log('\n✅ Registry build complete!');
  console.log(`\n📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`   └── ${allRegistryEntries.length} components across ${Object.values(componentsByCategory).filter(c => c.length > 0).length} categories`);
}

buildRegistry().catch((error) => {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
});
