import 'reflect-metadata';
import * as path from 'path';
import dotenv from 'dotenv';
dotenv.config({
  path: path.resolve(__dirname, `../config/${process.env.NODE_ENV || ''}.env`),
});
import { DataSource } from 'typeorm';
import { entities } from './entities';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.TYPEORM_DATABASE_HOST,
  port: Number(process.env.TYPEORM_DATABASE_PORT),
  username: process.env.TYPEORM_DATABASE_USER,
  password: process.env.TYPEORM_DATABASE_PASSWORD,
  database: process.env.TYPEORM_DATABASE_NAME,
  synchronize: process.env.NODE_ENV === 'development',
  logging: false,
  entities,
  migrations: ['./migrations/*.ts'],
  subscribers: [],
});

export async function initializeDataSource() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
}
