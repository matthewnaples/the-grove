import chalk from 'chalk';

const REGISTRY_BASE_URL = 'https://raw.githubusercontent.com/matthewnaples/the-grove/main/packages/registry/registry';

interface ListOptions {
  category?: string;
  tag?: string;
}

export async function list(options: ListOptions) {
  console.log(chalk.bold('\n📦 Available Components\n'));

  const categories = options.category
    ? [options.category]
    : ['core', 'convex', 'clerk', 'convex-clerk'];

  for (const category of categories) {
    console.log(chalk.bold.blue(`\n${category.toUpperCase()}:`));

    try {
      const components = await fetchCategoryComponents(category);

      for (const component of components) {
        if (options.tag && !component.tags?.includes(options.tag)) {
          continue;
        }

        const deps = component.dependencies?.length
          ? chalk.gray(` (requires: ${component.dependencies.join(', ')})`)
          : '';

        console.log(`  ${chalk.green(component.name)}${deps}`);
        if (component.description) {
          console.log(`    ${chalk.gray(component.description)}`);
        }
      }
    } catch (error) {
      console.log(chalk.gray(`  No components found`));
    }
  }

  console.log(chalk.gray('\nRun `npx the-grove add <component>` to install\n'));
}

async function fetchCategoryComponents(category: string) {
  const indexUrl = `${REGISTRY_BASE_URL}/${category}/index.json`;

  try {
    const response = await fetch(indexUrl);
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}
