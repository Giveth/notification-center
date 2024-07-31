import * as path from 'path';
import dotenv from 'dotenv';
dotenv.config({
  path: path.resolve(__dirname, `../config/${process.env.NODE_ENV || ''}.env`),
});

import { initServer } from '../src/server';
import { AppDataSource } from '../src/dataSource';
import { sleep } from './testUtils';

/* eslint-disable @typescript-eslint/no-var-requires */
const { dropdb, createdb } = require('pgtools');

async function dropDatabaseAndCreateFreshOne() {
  const config = {
    user: process.env.TYPEORM_DATABASE_USER,
    password: process.env.TYPEORM_DATABASE_PASSWORD,
    port: process.env.TYPEORM_DATABASE_PORT,
    host: process.env.TYPEORM_DATABASE_HOST,
  };

  // tslint:disable-next-line:no-console
  console.log('Dropping DB');
  try {
    await dropdb(config, process.env.TYPEORM_DATABASE_NAME);
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log('drop db error', e);
  }

  // tslint:disable-next-line:no-console
  console.log('Create Fresh DB');
  try {
    await createdb(config, process.env.TYPEORM_DATABASE_NAME);
    console.log('Fresh DB has been created');
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log('Create Fresh db error', e);
  }
}

async function runMigrations() {
  try {
    const dataSource = await AppDataSource.initialize();
    await dataSource.runMigrations({ transaction: 'all' });
    console.log('Migrations have been executed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

const seedDb = async () => {
  //
};

(async () => {
  try {
    await dropDatabaseAndCreateFreshOne();
    await runMigrations();
    await seedDb();
    await initServer();
    await sleep(500);
  } catch (e: any) {
    throw new Error(`Could not setup tests requirements \n${e.message}`);
  }
})();
