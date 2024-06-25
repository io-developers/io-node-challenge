import log4js from 'log4js';
import { ILogger } from './ILogger'; // Interfaz para el logger

log4js.configure({
  appenders: {
    console: { type: 'console' },
  },
  categories: {
    default: { appenders: ['console'], level: 'info' },
  },
});

const loggerInstance = log4js.getLogger();

class Logger implements ILogger {
  info(message: string, meta?: any): void {
    loggerInstance.info(message, meta);
  }

  error(message: string, meta?: any): void {
    loggerInstance.error(message, meta);
  }
}

export const logger = new Logger();
