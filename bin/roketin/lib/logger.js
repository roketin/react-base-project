const log = (message, method = 'log') => {
  if (Array.isArray(message)) {
    console[method](...message);
  } else {
    console[method](message);
  }
};

export const logger = {
  info: (message) => log(message, 'log'),
  warn: (message) => log(message, 'warn'),
  error: (message) => log(message, 'error'),
  success: (message) => log(message, 'log'),
  skip: (message) => log(message, 'log'),
};

export const logCreated = (filePath, existed) => {
  logger.success(`${existed ? '🟣 Overwritten' : '🟢 Created'}: ${filePath}`);
};

export const logSkipped = (filePath) => {
  logger.skip(`🔵 Skipped: ${filePath}`);
};
