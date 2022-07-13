import dotenv from 'dotenv';
import * as path from 'path';
import { initServer } from '../src/server';
import { AppDataSource } from '../src/dataSource';
import { assert } from 'chai';
import { Organization } from '../src/entities/organization';
import { SEED_DATA } from './testUtils';
import { Application } from '../src/entities/application';
import { findOrganizationById } from '../src/repositories/organizationRepository';

dotenv.config({
  path: path.resolve(__dirname, `../config/${process.env.NODE_ENV || ''}.env`),
});
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
  await (
    await AppDataSource.initialize()
  ).runMigrations({
    transaction: 'all',
  });
  console.log('Migrations has been executed successfully');
}

const seedOrganizations = async () => {
  await Organization.create({ ...SEED_DATA.firstOrganization }).save();
};
const seedApplications = async () => {
  const applicationData: any = { ...SEED_DATA.firstApplication };
  applicationData.organization = await findOrganizationById(
    applicationData.organizationId,
  );
  await Application.create(applicationData).save();
};
const seedDb = async () => {
  //
};

before(async () => {
  try {
    await dropDatabaseAndCreateFreshOne();
    await runMigrations();
    await seedDb();
    await initServer();
  } catch (e: any) {
    throw new Error(`Could not setup tests requirements \n${e.message}`);
  }
});
