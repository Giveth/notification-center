import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(__dirname, `../config/${process.env.NODE_ENV || ''}.env`),
});

import { initDbConnection, initServer } from './server';
import { logger } from './utils/logger';

initDbConnection()
  .then(() => {
    return initServer();
  })
  .then(() => {
    console.log('server is up');
    logger.info('server is up');
  })
  .catch(e => {
    console.log('init server error', e);
    logger.error('init server error', e);
    throw e;
  });
