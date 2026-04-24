const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

async function buildTemplate() {
    console.log(chalk.blue('Building template...'));

    const sourceDir = path.join(__dirname, '../../isw-next-starter');
    const templateDir = path.join(__dirname, '../template');

    // Clean template directory
    await fs.remove(templateDir);
    await fs.ensureDir(templateDir);

    // Copy template files, excluding generated directories
    await fs.copy(sourceDir, templateDir, {
        filter: (src, dest) => {
            const relativePath = path.relative(sourceDir, src);

            // Exclude these directories/files
            const excluded = [
                'node_modules',
                '.next',
                'coverage',
                'dist',
                'build',
                '.git',
                '.env.local',
                '.env.production',
                'npm-debug.log*',
                'yarn-debug.log*',
                'yarn-error.log*',
            ];

            return !excluded.some(exclude =>
                relativePath === exclude ||
                relativePath.startsWith(exclude + path.sep)
            );
        }
    });

    console.log(chalk.green('Template built successfully!'));
}

buildTemplate().catch(error => {
    console.error(chalk.red('Build failed:'), error);
    process.exit(1);
});