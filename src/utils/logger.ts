import RotatingFileStream from 'bunyan-rotating-file-stream';

import { createLogger, levelFromName, DEBUG, LogLevelString } from 'bunyan';

function createBunyanLogger() {
  const logDir = process.env.LOG_PATH || './logs/apiGive.log';
  // tslint:disable-next-line:no-console
  console.log('Bunyan log level is', process.env.LOG_LEVEL || 'debug');
  const bunyanStreams: any = [
    {
      type: 'raw',
      stream: new RotatingFileStream({
        path: logDir,
        period: '30d', // monthly rotation
        totalFiles: 30, // keep 30 back copies
        rotateExisting: true, // Give ourselves a clean file when we start up, based on period
        threshold: '100m', // Rotate log files larger than 100 megabytes
        totalSize: '500m', // Don't keep more than 500 megabytes of archived log files
        gzip: false, // Compress the archive log files to save space
      }),
    },
  ];

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    // Adding logs to console in local machine and running tests
    bunyanStreams.push({
      stream: process.stdout,
    });
  }
  return createLogger({
    name: 'apiGive',
    level: levelFromName[process.env.LOG_LEVEL as LogLevelString] || DEBUG,
    // level :process.env.LOG_LEVEL | 'error',
    streams: bunyanStreams,
  });
}

export const logger = createBunyanLogger();
