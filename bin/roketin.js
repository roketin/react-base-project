#!/usr/bin/env node
import { run } from './roketin/cli.js';

run().catch((error) => {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : JSON.stringify(error);
  console.error(`❌ ${message}`);
  process.exit(1);
});
