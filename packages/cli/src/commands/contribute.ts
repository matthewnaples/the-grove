import { Octokit } from '@octokit/rest';
import fs from 'fs-extra';
import path from 'path';
import prompts from 'prompts';
import ora from 'ora';
import chalk from 'chalk';

const TEMPLATE_REPO = {
  owner: 'matthewnaples',
  repo: 'the-grove',
  branch: 'main',
};

export async function contribute(filePaths: string[]) {
  const spinner = ora();

  try {
    // 1. Validate files exist
    const files = [];
    for (const fp of filePaths) {
      if (!await fs.pathExists(fp)) {
        throw new Error(`File not found: ${fp}`);
      }

      files.push({
        localPath: fp,
        content: await fs.readFile(fp, 'utf-8'),
        componentName: path.basename(fp, path.extname(fp)),
      });
    }

    // 2. Prompt for context
    const answers = await prompts([
      {
        type: 'select',
        name: 'changeType',
        message: 'What kind of change is this?',
        choices: [
          { title: 'New component', value: 'feat' },
          { title: 'Bug fix', value: 'fix' },
          { title: 'Enhancement', value: 'enhance' },
        ],
      },
      {
        type: 'text',
        name: 'description',
        message: 'Describe your changes:',
        initial: files.length === 1
          ? `Update ${files[0].componentName}`
          : `Update ${files.length} components`,
      },
    ]);

    if (!answers.changeType || !answers.description) {
      console.log(chalk.gray('Cancelled.'));
      return;
    }

    // 3. Get GitHub token
    const token = process.env.GITHUB_TOKEN || await promptForToken();

    // 4. Setup GitHub client
    const octokit = new Octokit({ auth: token });

    spinner.start('Creating branch...');

    // 5. Get main branch SHA
    const { data: refData } = await octokit.git.getRef({
      ...TEMPLATE_REPO,
      ref: `heads/${TEMPLATE_REPO.branch}`,
    });
    const mainSha = refData.object.sha;

    // 6. Create new branch
    const branchName = `${answers.changeType}/${files[0].componentName}-${Date.now()}`;
    await octokit.git.createRef({
      ...TEMPLATE_REPO,
      ref: `refs/heads/${branchName}`,
      sha: mainSha,
    });

    spinner.succeed(`Created branch: ${branchName}`);

    // 7. Commit each file
    for (const file of files) {
      spinner.start(`Uploading ${file.localPath}...`);

      const templatePath = mapLocalPathToTemplate(file.localPath);

      // Check if file exists
      let existingFileSha: string | undefined;
      try {
        const { data: existingFile } = await octokit.repos.getContent({
          ...TEMPLATE_REPO,
          path: templatePath,
          ref: branchName,
        });
        if ('sha' in existingFile) {
          existingFileSha = existingFile.sha;
        }
      } catch {
        // File doesn't exist
      }

      await octokit.repos.createOrUpdateFileContents({
        ...TEMPLATE_REPO,
        path: templatePath,
        message: `${answers.changeType}: ${file.componentName}`,
        content: Buffer.from(file.content).toString('base64'),
        branch: branchName,
        sha: existingFileSha,
      });

      spinner.succeed(`${existingFileSha ? 'Updated' : 'Added'} ${templatePath}`);
    }

    // 8. Create PR
    spinner.start('Creating pull request...');

    const { data: pr } = await octokit.pulls.create({
      ...TEMPLATE_REPO,
      title: answers.description,
      head: branchName,
      base: TEMPLATE_REPO.branch,
      body: generatePRBody(files, answers),
    });

    spinner.succeed('Pull request created!');

    console.log(chalk.green('\n✅ Contribution submitted successfully!'));
    console.log(chalk.blue(`🔗 ${pr.html_url}`));
    console.log(chalk.gray('\nReview and merge when ready.'));

  } catch (error) {
    spinner.fail('Failed to contribute');
    console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
    process.exit(1);
  }
}

function mapLocalPathToTemplate(localPath: string): string {
  // components/ui/button.tsx -> packages/components/src/core/button/index.tsx
  // components/fancy-table.tsx -> packages/components/src/core/fancy-table/index.tsx

  const normalized = localPath
    .replace(/^\.\//, '')
    .replace(/components\/ui\//, 'components/')
    .replace(/components\//, '');

  const name = path.basename(normalized, path.extname(normalized));

  // Default to core category (can be enhanced to detect category)
  return `packages/components/src/core/${name}/index.tsx`;
}

async function promptForToken(): Promise<string> {
  const { token } = await prompts({
    type: 'password',
    name: 'token',
    message: 'Enter your GitHub personal access token:',
    validate: (value: string) => value.length > 0 || 'Token is required',
  });

  return token;
}

function generatePRBody(
  files: Array<{ componentName: string; localPath: string }>,
  answers: { changeType: string; description: string }
): string {
  return `## ${answers.description}

### Changes
${files.map(f => `- ${f.localPath}`).join('\n')}

### Type
\`${answers.changeType}\`

---
*Contributed via \`npx the-grove contribute\`*`;
}
