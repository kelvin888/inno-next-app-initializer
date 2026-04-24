#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const ora = require('ora');
const validateProjectName = require('validate-npm-package-name');

const packageJson = require('../package.json');

program
    .name('create-inno-next-app')
    .description('Create a new Next.js application with Inno starter template')
    .version(packageJson.version)
    .argument('[project-name]', 'name of the project')
    .option('-y, --yes', 'skip prompts and use defaults')
    .option('--template <template>', 'template variant to use', 'dashboard')
    .action(async (projectName, options) => {
        try {
            await createProject(projectName, options);
        } catch (error) {
            console.error(chalk.red('Error creating project:'), error.message);
            process.exit(1);
        }
    });

async function createProject(projectName, options) {
    console.log(chalk.blue.bold('\n🚀 Inno Next.js App Creator\n'));

    // Handle current directory (.) case
    const isCurrentDir = projectName === '.';

    if (isCurrentDir) {
        // Use current directory name as project name
        projectName = path.basename(process.cwd());
    }

    // Get project name if not provided
    if (!projectName) {
        const { name } = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is your project name?',
                default: 'my-isw-app',
                validate: (input) => {
                    const validation = validateProjectName(input);
                    if (!validation.validForNewPackages) {
                        return validation.errors?.[0] || validation.warnings?.[0] || 'Invalid project name';
                    }
                    return true;
                },
            },
        ]);
        projectName = name;
    }

    // Validate project name
    const validation = validateProjectName(projectName);
    if (!validation.validForNewPackages) {
        throw new Error(validation.errors?.[0] || validation.warnings?.[0] || 'Invalid project name');
    }

    let projectPath = isCurrentDir ? process.cwd() : path.resolve(process.cwd(), projectName);

    // Check if directory already exists
    if (await fs.pathExists(projectPath)) {
        const { overwrite } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'overwrite',
                message: `Directory "${projectName}" already exists. Overwrite?`,
                default: false,
            },
        ]);

        if (!overwrite) {
            console.log(chalk.yellow('Operation cancelled.'));
            return;
        }

        await fs.remove(projectPath);
    }

    // Get configuration if not using defaults
    let config = {
        appName: projectName,
        template: options.template || 'dashboard',
        features: {
            typescript: true,
            tailwind: true,
            authentication: true,
            theming: true,
        },
    };

    if (!options.yes) {
        config = await getProjectConfiguration(config);
    }

    // Update project path if user changed the app name
    const finalProjectName = config.appName || projectName;
    const finalProjectPath = path.resolve(process.cwd(), finalProjectName);

    // If user changed the name, we need to use the new path
    if (finalProjectPath !== projectPath) {
        projectPath = finalProjectPath;
        projectName = finalProjectName;
    }

    // Create project
    const spinner = ora('Creating project...').start();

    try {
        // Create project directory
        await fs.ensureDir(projectPath);

        // Copy template files
        const templatePath = path.join(__dirname, '../template');
        await copyTemplate(templatePath, projectPath, config);

        // Update package.json with project name
        await updatePackageJson(projectPath, projectName);

        // Create environment file
        await createEnvironmentFile(projectPath, config);

        spinner.succeed('Project created successfully!');

        // Show next steps
        showNextSteps(projectName);
    } catch (error) {
        spinner.fail('Failed to create project');
        throw error;
    }
}

async function getProjectConfiguration(defaultConfig) {
    console.log(chalk.cyan('\n📋 Project Configuration\n'));

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'appName',
            message: 'Application name:',
            default: defaultConfig.appName,
        },
        {
            type: 'list',
            name: 'template',
            message: 'Choose a template variant:',
            choices: [
                { name: '🏢 Admin Dashboard (Full featured)', value: 'dashboard' },
                { name: '📱 Simple App (Minimal setup)', value: 'simple' },
                { name: '🏢 Enterprise (Security focused)', value: 'enterprise' },
            ],
            default: 'dashboard',
        },
        {
            type: 'checkbox',
            name: 'features',
            message: 'Select additional features:',
            choices: [
                { name: 'Error Reporting', value: 'errorReporting', checked: false },
                { name: 'Analytics Integration', value: 'analytics', checked: false },
                { name: 'PWA Support', value: 'pwa', checked: false },
            ],
        },
        {
            type: 'input',
            name: 'apiUrl',
            message: 'API Base URL:',
            default: 'http://localhost:8080',
            validate: (input) => {
                try {
                    new URL(input);
                    return true;
                } catch {
                    return 'Please enter a valid URL';
                }
            },
        },
    ]);

    return {
        appName: answers.appName,
        template: answers.template,
        features: {
            typescript: true,
            tailwind: true,
            authentication: true,
            theming: true,
            errorReporting: answers.features.includes('errorReporting'),
            analytics: answers.features.includes('analytics'),
            pwa: answers.features.includes('pwa'),
        },
        apiUrl: answers.apiUrl,
    };
}

async function copyTemplate(templatePath, projectPath, config) {
    // Copy all template files
    await fs.copy(templatePath, projectPath, {
        filter: (src) => {
            const relativePath = path.relative(templatePath, src);
            // Exclude certain directories/files
            const excluded = [
                'node_modules',
                '.next',
                'coverage',
                '.git',
                'dist',
                'build',
                '.env.local',
            ];
            return !excluded.some(exclude => relativePath.includes(exclude));
        },
    });

    // Process template files with configuration
    await processTemplateFiles(projectPath, config);
}

async function processTemplateFiles(projectPath, config) {
    // Update templateConfig.ts with user preferences
    const configPath = path.join(projectPath, 'src/lib/templateConfig.ts');
    if (await fs.pathExists(configPath)) {
        let content = await fs.readFile(configPath, 'utf8');

        // Replace default values with user configuration
        content = content.replace(
            'My Next.js App',
            config.appName
        );

        if (config.apiUrl) {
            content = content.replace(
                'http://localhost:8080',
                config.apiUrl
            );
        }

        await fs.writeFile(configPath, content);
    }

    // Update app layout with project name
    const layoutPath = path.join(projectPath, 'src/app/layout.tsx');
    if (await fs.pathExists(layoutPath)) {
        let content = await fs.readFile(layoutPath, 'utf8');
        content = content.replaceAll('KO Next.js Starter', config.appName);
        await fs.writeFile(layoutPath, content);
    }

    // Update proxy route with project name
    const proxyPath = path.join(projectPath, 'src/app/api/proxy/[...path]/route.ts');
    if (await fs.pathExists(proxyPath)) {
        let content = await fs.readFile(proxyPath, 'utf8');
        content = content.replaceAll('{{PROJECT_NAME}}', config.appName);
        await fs.writeFile(proxyPath, content);
    }
}

async function updatePackageJson(projectPath, projectName) {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath);
        packageJson.name = projectName;
        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }
}

async function createEnvironmentFile(projectPath, config) {
    const envContent = `# Application Configuration
NEXT_PUBLIC_APP_NAME="${config.appName}"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# API Configuration
NEXT_PUBLIC_BASE_URL="${config.apiUrl || 'http://localhost:8080'}"
NEXT_PUBLIC_TIMEOUT="30000"
NEXT_PUBLIC_USE_PROXY="true"

# Authentication
NEXT_PUBLIC_SESSION_TIMEOUT="30"
NEXT_PUBLIC_INACTIVITY_TIMEOUT="15"

# Features
NEXT_PUBLIC_ENABLE_ERROR_REPORTING="${config.features.errorReporting || 'false'}"
NEXT_PUBLIC_ENABLE_ANALYTICS="${config.features.analytics || 'false'}"
NEXT_PUBLIC_ENABLE_PWA="${config.features.pwa || 'false'}"

# Theme
NEXT_PUBLIC_DEFAULT_THEME="light"
NEXT_PUBLIC_PRIMARY_COLOR="#0275d8"
NEXT_PUBLIC_SECONDARY_COLOR="#64748b"

# Development
NEXT_PUBLIC_DEBUG="false"
`;

    await fs.writeFile(path.join(projectPath, '.env.local'), envContent);
}

function showNextSteps(projectName) {
    console.log(chalk.green('\n✅ Project created successfully!\n'));
    console.log(chalk.cyan('Next steps:\n'));
    console.log(chalk.white(`  1. cd ${projectName}`));
    console.log(chalk.white('  2. npm install'));
    console.log(chalk.white('  3. npm run dev'));
    console.log(chalk.white('\n📚 Documentation:'));
    console.log(chalk.gray('  • Check README.md for detailed setup instructions'));
    console.log(chalk.gray('  • Follow CHECKLIST.md to ensure proper configuration'));
    console.log(chalk.gray('  • Read TEMPLATE_SETUP.md for advanced customization'));
    console.log(chalk.white('\n🚀 Happy coding!\n'));
}

// Handle errors
process.on('unhandledRejection', (reason) => {
    console.error(chalk.red('Unhandled promise rejection:'), reason);
    process.exit(1);
});

program.parse();