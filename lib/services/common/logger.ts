import { Logger } from '@aws-lambda-powertools/logger';

let logger: Logger;

// singleton
export const getLogger = (): Logger => {
  if (logger) return logger;
  logger = new Logger({ serviceName: 'vital-integration' });

  return logger;
};
