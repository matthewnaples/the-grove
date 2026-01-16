import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { glob } from 'glob';
import type { RegistryEntry } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REGISTRY_DIR = path.resolve(__dirname, '../registry');
const COMPONENTS_DIR = path.resolve(__dirname, '../../components/src');

async function validateRegistry() {
  console.log('🔍 Validating registry...\n');

  const registryFiles = await glob('**/*.json', {
    cwd: REGISTRY_DIR,
  });

  let errors = 0;

  for (const file of registryFiles) {
    const fullPath = path.join(REGISTRY_DIR, file);
    const entry: RegistryEntry = await fs.readJson(fullPath);

    // Validate required fields
    if (!entry.name || !entry.type || !entry.category) {
      console.error(`❌ ${file}: Missing required fields`);
      errors++;
      continue;
    }

    // Validate files exist
    for (const fileEntry of entry.files) {
      const componentPath = path.join(COMPONENTS_DIR, fileEntry.path.replace('components/', ''));
      if (!await fs.pathExists(componentPath)) {
        console.error(`❌ ${file}: Referenced file doesn't exist: ${fileEntry.path}`);
        errors++;
      }
    }

    // Validate registry dependencies exist
    for (const dep of entry.registryDependencies || []) {
      const depFiles = await glob(`**/${dep}.json`, { cwd: REGISTRY_DIR });
      if (depFiles.length === 0) {
        console.warn(`⚠️  ${file}: Registry dependency not found: ${dep}`);
      }
    }
  }

  if (errors === 0) {
    console.log('\n✅ All registry entries are valid!');
  } else {
    console.log(`\n❌ Found ${errors} error(s)`);
    process.exit(1);
  }
}

validateRegistry().catch(console.error);
