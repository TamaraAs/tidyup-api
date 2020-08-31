import { Logger, createLogger, format, transports } from 'winston';

export const logger: Logger = createLogger({
  level: 'info',
  format: format.simple(),
  transports: [new transports.Console()]
});
