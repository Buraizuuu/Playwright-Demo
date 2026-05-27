import winston from 'winston';
import path from 'path';
import fs from 'fs';

const logsDir = path.join(process.cwd(), 'logs');

// Auto-create logs/ directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const { combine, timestamp, printf, colorize } = winston.format;

// Shared format for all file transports
const fileFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(({ timestamp, level, message }) => `[${timestamp}] [${level.toUpperCase()}] ${message}`)
);

// Filter: pass through only the specified level
const onlyLevel = (targetLevel: string) =>
  winston.format((info) => (info.level === targetLevel ? info : false))();

const logger = winston.createLogger({
  level: 'info',
  transports: [
    // Console — colorized output visible during `npx playwright test`
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ timestamp, level, message }) => `[${timestamp}] [${level}] ${message}`)
      ),
    }),

    // info.log — info-level messages only (test steps, navigation, actions)
    new winston.transports.File({
      filename: path.join(logsDir, 'info.log'),
      format: combine(onlyLevel('info'), fileFormat),
    }),

    // error.log — error-level messages only (failures, caught exceptions)
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: fileFormat,
    }),

    // test.log — all levels combined (full test execution trace)
    new winston.transports.File({
      filename: path.join(logsDir, 'test.log'),
      format: fileFormat,
    }),
  ],
});

export { logger };
