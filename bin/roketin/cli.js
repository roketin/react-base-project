import { renderBanner } from './lib/banner.js';
import { validateCommand } from './lib/validation.js';
import { logger } from './lib/logger.js';
import { getFeature, listFeatures } from './features/index.js';
import { cliVersion } from './lib/version.js';

function printHelp() {
  const features = listFeatures();
  logger.info('Usage: pnpm roketin <feature> [...args]');
  logger.info(`Version: v${cliVersion}`);
  logger.info('Available features:');
  features.forEach((feature) => {
    const aliasText = feature.aliases?.length
      ? ` (aliases: ${feature.aliases.join(', ')})`
      : '';
    logger.info(`  - ${feature.name}${aliasText}: ${feature.description}`);
  });
}

export async function run(argv = process.argv.slice(2)) {
  const [command, ...args] = argv;

  if (
    !command ||
    command === 'help' ||
    command === '--help' ||
    command === '-h'
  ) {
    renderBanner();
    logger.info(`Roketin CLI v${cliVersion}`);
    printHelp();
    return;
  }

  validateCommand(command);

  const feature = getFeature(command);

  if (!feature) {
    renderBanner();
    logger.error(`❌ Unknown feature: ${command}`);
    logger.info(`Roketin CLI v${cliVersion}`);
    printHelp();
    process.exit(1);
  }

  renderBanner();
  logger.info(`Roketin CLI v${cliVersion}`);

  await feature.handler({
    command,
    args,
  });
}
