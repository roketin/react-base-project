import { logger } from './logger.js';

export function validateCommand(command) {
  if (!command) {
    logger.error('❌ Usage: pnpm roketin <feature> [...args]');
    process.exit(1);
  }
}
