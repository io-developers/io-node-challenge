import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'technical-io-app' },
  transports: [new winston.transports.Console()],
});

export default logger;
