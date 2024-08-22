import * as log4js from "log4js";
import { ILogger } from '../../domain/interfaces/ILogger';

export class Logger implements ILogger {
  private logger: log4js.Logger;

  constructor() {
    log4js.configure({
      appenders: {
        console: { type: 'console' },
      },
      categories: {
        default: { appenders: ['console'], level: 'info' },
      },
    });

    this.logger = log4js.getLogger();
  }

  debug(message: string): void {
    this.logger.debug(message);
  }

  info(message: string): void {
    this.logger.info(message);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }

  error(message: string): void {
    this.logger.error(message);
  }
}
