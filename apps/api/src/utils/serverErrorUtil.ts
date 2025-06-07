import { logger } from './loggerUtil';

export const handleServerError = (
  error: NodeJS.ErrnoException,
  port: number
): void => {
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      break;
    default:
      logger.error('Server error', {
        error: error.message,
        stack: error.stack,
      });
  }

  process.exit(1);
};