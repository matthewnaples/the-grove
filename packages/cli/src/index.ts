#!/usr/bin/env node

import { Command } from 'commander';
import { add } from './commands/add';
import { contribute } from './commands/contribute';
import { list } from './commands/list';

const program = new Command();

program
  .name('grove-kit')
  .description('Component library CLI for managing UI components')
  .version('0.1.0');

program
  .command('add')
  .description('Add component(s) to your project')
  .argument('[components...]', 'Component names to add')
  .option('-p, --path <path>', 'Custom installation path')
  .option('-y, --yes', 'Skip confirmation prompts')
  .action(add);

program
  .command('contribute')
  .description('Contribute component(s) back to the template repository')
  .argument('<files...>', 'Component file paths to contribute')
  .action(contribute);

program
  .command('list')
  .description('List all available components')
  .option('-c, --category <category>', 'Filter by category (core, convex, clerk, convex-clerk)')
  .option('-t, --tag <tag>', 'Filter by tag')
  .action(list);

program.parse();
