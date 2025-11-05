import fs from 'fs';
import { select } from '@inquirer/prompts';
import dayjs from 'dayjs';
import { execSync } from 'child_process';

const file = './version.ts';

function bump(ver, type) {
  const [major, minor, patch] = ver.split('.').map(Number);
  if (type === 'major') return `${major + 1}.0.0`;
  if (type === 'minor') return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

export default async function versionFeature({ args }) {
  // 🛠 Ensure version.ts exists and contains APP_VERSION
  if (!fs.existsSync(file)) {
    console.log('ℹ️ version.ts not found — creating...');
    fs.writeFileSync(file, `export const APP_VERSION = "0.0.1";`);
    console.log('✅ version.ts created with default version 0.0.1');
  }

  // Validate and repair version.ts format if needed
  let raw = fs.readFileSync(file, 'utf8');
  if (!raw.match(/APP_VERSION\s*=\s*".+?"/)) {
    console.log('⚠️ APP_VERSION not found or malformed — fixing...');
    raw = `export const APP_VERSION = "0.0.1";`;
    fs.writeFileSync(file, raw);
    console.log('✅ version.ts reset to default');
  }

  let text = fs.readFileSync(file, 'utf8');
  const current = text.match(/APP_VERSION = "(.+?)"/)[1];

  console.clear();
  console.log(` 🚀 Roketin Release System | Current App Version: ${current}`);

  // Verify branch = develop
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD')
      .toString()
      .trim();
    if (branch !== 'develop' && branch !== 'ddd') {
      console.log(
        `❌ Release blocked: You are on '${branch}' branch. Switch to 'develop' before releasing.`,
      );
      return;
    }
  } catch {
    console.log('⚠️ Unable to determine Git branch. Aborting for safety.');
    return;
  }

  // Check git status — block release if no changes
  try {
    const status = execSync('git status --porcelain').toString().trim();
    if (!status) {
      console.log('⚠️ No changes detected in Git. Nothing to release.');
      return;
    }
  } catch {
    console.log('⚠️ Unable to verify git status. Aborting for safety.');
    return;
  }

  const type = await select({
    message: 'Select release type:',
    choices: [
      {
        name: 'Patch',
        value: 'patch',
      },
      {
        name: 'Minor',
        value: 'minor',
      },
      {
        name: 'Major',
        value: 'major',
      },
    ],
    default: args[0] || 'patch',
  });

  const next = bump(current, type);

  // Preview changelog before confirm
  console.log('\n📄 Changelog Preview (git-cliff output):\n');
  try {
    execSync(`git-cliff --tag ${next} --unreleased`, { stdio: 'inherit' });
  } catch {
    console.log('⚠️ Unable to preview changelog. Continuing...');
  }

  // Ask confirmation
  const confirm = await select({
    message: `Confirm release ${next}?`,
    choices: [
      { name: '✅ Yes, publish', value: true },
      { name: '❌ Cancel', value: false },
    ],
  });

  if (!confirm) {
    console.log('⚠️ Release cancelled');
    return;
  }

  fs.writeFileSync(file, text.replace(current, next));

  // ==== CHANGELOG FINALIZE LOGIC (git-cliff append mode) ====
  const changelogFile = './CHANGELOG.md';

  // Ensure CHANGELOG exists
  if (!fs.existsSync(changelogFile)) {
    console.log('ℹ️ CHANGELOG.md not found — creating...');
    fs.writeFileSync(changelogFile, '');
  }

  console.log('🌀 Running git-cliff to append release notes...');
  try {
    execSync(`git-cliff --tag ${next} --unreleased --prepend CHANGELOG.md`, {
      stdio: 'inherit',
    });
    console.log('📝 git-cliff appended changelog entries');
  } catch (e) {
    console.log('❌ Failed running git-cliff, check config.');
  }

  console.log(`
  ✅ Release Complete!
  📦 Version: ${current} → ${next}
  🕓 ${dayjs().format('YYYY-MM-DD HH:mm')}
  🎉 Everything shipped successfully!
  `);

  // Create git tag for release
  try {
    execSync(`git tag v${next}`);
    console.log(`🏷️  Created tag v${next}`);

    execSync(`git push --tags`);
    console.log('📤 Tags pushed to remote');
  } catch (err) {
    console.log(
      '⚠️ Failed to create or push git tag. You may need to do it manually.',
    );
  }

  console.log('\x07'); // play terminal bell sound
}
