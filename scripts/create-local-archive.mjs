import { execFileSync } from 'node:child_process';
import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { basename, resolve } from 'node:path';

const rootDir = resolve(import.meta.dirname, '..');
const artifactsDir = resolve(rootDir, 'artifacts');
const stagingDir = resolve(artifactsDir, 'design-system-local');
const docsArchiveDir = resolve(rootDir, 'dist-docs-archive');
const packageJsonPath = resolve(rootDir, 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

const version = packageJson.version;
const releaseArchiveName = `design-system-local-v${version}.tar.gz`;
const releaseArchivePath = resolve(artifactsDir, releaseArchiveName);

const run = (command, args) => {
  execFileSync(command, args, {
    cwd: rootDir,
    stdio: 'inherit',
  });
};

const runQuiet = (command, args) => execFileSync(command, args, {
  cwd: rootDir,
  encoding: 'utf8',
}).trim();

const ensureCleanDirectory = (directoryPath) => {
  rmSync(directoryPath, { recursive: true, force: true });
  mkdirSync(directoryPath, { recursive: true });
};

const writeInstallGuide = (packageTarballName) => {
  const installGuide = `# Local distribution

This archive contains:

1. \`${packageTarballName}\`
   - Install this file in another project with Bun / npm.
2. \`preview/\`
   - Static design-system preview that can be served locally on any computer.

## 1) Install into another project

### Bun
\`\`\`bash
bun add file:./${packageTarballName}
\`\`\`

### npm
\`\`\`bash
npm install ./${packageTarballName}
\`\`\`

### Example usage
\`\`\`ts
import '@design-system/core';
import '@design-system/core/styles/tokens.css';
\`\`\`

## 2) Run the preview on another computer

### Python 3
\`\`\`bash
python3 -m http.server 4173 -d preview
\`\`\`

Then open:
\`\`\`
http://127.0.0.1:4173
\`\`\`

### Alternative
If your environment already has a static server:
\`\`\`bash
npx serve preview
\`\`\`
`;

  writeFileSync(resolve(stagingDir, 'INSTALL.md'), installGuide);
};

ensureCleanDirectory(artifactsDir);

run('bun', ['run', 'build']);
run('bun', ['run', 'docs:build:archive']);

const packageTarballName = runQuiet('bun', [
  'pm',
  'pack',
  '--destination',
  './artifacts',
  '--quiet',
]);

ensureCleanDirectory(stagingDir);
copyFileSync(
  resolve(artifactsDir, packageTarballName),
  resolve(stagingDir, basename(packageTarballName)),
);
cpSync(docsArchiveDir, resolve(stagingDir, 'preview'), { recursive: true });
writeInstallGuide(basename(packageTarballName));

rmSync(releaseArchivePath, { force: true });
run('tar', ['-czf', releaseArchivePath, '-C', artifactsDir, 'design-system-local']);

console.log(`\nCreated local archive: ${releaseArchivePath}`);
