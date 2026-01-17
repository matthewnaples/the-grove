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
}

export async function add(components: string[], options: AddOptions) {
  if (!components || components.length === 0) {
    console.log(chalk.yellow('No components specified.'));
    console.log('Usage: npx the-grove add <component-name>');
    console.log('\nRun `npx the-grove list` to see available components.');
    return;
  }

  const spinner = ora();

  try {
    // Detect project stack
    const stack = await detectProjectStack();

    for (const componentName of components) {
      spinner.start(`Adding ${componentName}...`);

      // Determine component category
      const registryUrl = await findComponentRegistry(componentName);

      if (!registryUrl) {
        spinner.fail(`Component '${componentName}' not found`);
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
          continue;
        }
        spinner.start(`Adding ${componentName}...`);
      }

      // Use shadcn CLI to install
      spinner.text = `Installing ${componentName} via shadcn...`;

      const args = ['shadcn@latest', 'add', registryUrl];

      if (options.yes) {
        args.push('--yes');
      }
      if (options.path) {
        args.push('--path', options.path);
      }

      await execa('npx', args, { stdio: 'inherit' });

      spinner.succeed(`Added ${componentName}`);
    }

    console.log(chalk.green('\n✅ All components added successfully!'));
  } catch (error) {
    spinner.fail('Failed to add component');
    console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
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

