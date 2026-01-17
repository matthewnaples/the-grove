import { execa } from 'execa';
import ora from 'ora';
import chalk from 'chalk';
import prompts from 'prompts';
import fs from 'fs-extra';
import path from 'path';

const REGISTRY_BASE_URL = 'https://raw.githubusercontent.com/matthewnaples/the-grove/main/packages/registry/registry';

interface AddOptions {
  path?: string;
  yes?: boolean;
  overwrite?: boolean;
}

export async function add(components: string[], options: AddOptions) {
  if (!components || components.length === 0) {
    console.log(chalk.yellow('No components specified.'));
    console.log('Usage: npx the-grove add <component-name>');
    console.log('\nRun `npx the-grove list` to see available components.');
    return;
  }

  const spinner = ora();
  const results = {
    succeeded: [] as string[],
    failed: [] as string[],
    skipped: [] as string[],
  };

  try {
    // Detect project stack
    const stack = await detectProjectStack();

    for (const componentName of components) {
      spinner.start(`Adding ${componentName}...`);

      // Determine component category
      const registryUrl = await findComponentRegistry(componentName);

      if (!registryUrl) {
        spinner.fail(`Component '${componentName}' not found`);
        results.failed.push(componentName);
        continue;
      }

      // Fetch registry entry
      const registryEntry = await fetchRegistryEntry(registryUrl);

      // Check dependencies
      const missingDeps = await checkDependencies(registryEntry, stack);

      if (missingDeps.length > 0 && !options.yes) {
        spinner.stop();
        const { continue: shouldContinue } = await prompts({
          type: 'confirm',
          name: 'continue',
          message: `${componentName} requires: ${missingDeps.join(', ')}. Continue?`,
          initial: true,
        });

        if (!shouldContinue) {
          console.log(chalk.gray(`Skipped ${componentName}`));
          results.skipped.push(componentName);
          continue;
        }
        spinner.start(`Adding ${componentName}...`);
      }

      // Use shadcn CLI to install
      spinner.stop();
      console.log(chalk.gray(`Installing ${componentName} via shadcn...\n`));

      const args = ['shadcn@latest', 'add', registryUrl];

      if (options.yes) {
        args.push('--yes');
      }
      if (options.overwrite) {
        args.push('--overwrite');
      }
      if (options.path) {
        args.push('--path', options.path);
      }

      try {
        await execa('npx', args, { stdio: 'inherit' });
        console.log(chalk.green(`✓ Added ${componentName}`));
        results.succeeded.push(componentName);
      } catch (error) {
        console.log(chalk.red(`✗ Failed to add ${componentName}`));
        results.failed.push(componentName);
        // Continue with other components instead of throwing
      }
    }

    // Show final summary
    console.log('');
    if (results.succeeded.length > 0) {
      console.log(chalk.green(`✅ Successfully added ${results.succeeded.length} component(s)`));
    }
    if (results.failed.length > 0) {
      console.log(chalk.red(`✗ Failed to add ${results.failed.length} component(s): ${results.failed.join(', ')}`));
    }
    if (results.skipped.length > 0) {
      console.log(chalk.gray(`⊝ Skipped ${results.skipped.length} component(s): ${results.skipped.join(', ')}`));
    }

    // Exit with error code if nothing succeeded
    if (results.succeeded.length === 0 && (results.failed.length > 0 || results.skipped.length > 0)) {
      process.exit(1);
    }
  } catch (error) {
    spinner.stop();
    console.error(chalk.red('\n✗ Failed to add component'));
    if (error instanceof Error && error.message) {
      console.error(chalk.red(error.message));
    }
    process.exit(1);
  }
}

async function detectProjectStack() {
  try {
    const packageJson = await fs.readJson('./package.json');
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    return {
      hasConvex: 'convex' in deps,
      hasClerk: '@clerk/nextjs' in deps || '@clerk/clerk-react' in deps,
      hasNextAuth: 'next-auth' in deps,
    };
  } catch {
    return {
      hasConvex: false,
      hasClerk: false,
      hasNextAuth: false,
    };
  }
}

async function findComponentRegistry(componentName: string): Promise<string | null> {
  const categories = ['core', 'convex', 'clerk', 'convex-clerk'];

  for (const category of categories) {
    const url = `${REGISTRY_BASE_URL}/${category}/${componentName}.json`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        return url;
      }
    } catch {
      continue;
    }
  }

  return null;
}

async function fetchRegistryEntry(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch registry: ${url}`);
  }
  return response.json();
}

async function checkDependencies(registryEntry: any, stack: any): Promise<string[]> {
  const missing: string[] = [];

  const deps = registryEntry.dependencies || [];

  for (const dep of deps) {
    if (dep === 'convex' && !stack.hasConvex) {
      missing.push('convex');
    }
    if ((dep === '@clerk/nextjs' || dep === '@clerk/clerk-react') && !stack.hasClerk) {
      missing.push('clerk');
    }
  }

  return missing;
}

