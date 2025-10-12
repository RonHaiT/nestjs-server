import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { ConfigEnum } from './enum/config.enum';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const entitiesDir =
  process.env.NODE_ENV === 'test'
    ? [__dirname + '/**/*.entity.ts']
    : [__dirname + '/**/*.entity{.js,.ts}'];
function loadEnv(envPath: string): Record<string, any> {
  if (fs.existsSync(envPath)) {
    return dotenv.parse(fs.readFileSync(envPath, 'utf8'));
  }
  return {};
}
function buildConnectionOptions() {
  const defaultConfig = loadEnv('.env');
  const envConfig = loadEnv(`.env.${process.env.NODE_ENV || 'development'}`);
  const config = { ...defaultConfig, ...envConfig };

  return {
    type: config[ConfigEnum.DB_TYPE],
    host: config[ConfigEnum.DB_HOST],
    port: Number(config[ConfigEnum.DB_PORT]),
    username: config[ConfigEnum.DB_USERNAME],
    password: config[ConfigEnum.DB_PASSWORD],
    database: config[ConfigEnum.DB_DATABASE],
    entities: entitiesDir,
    synchronize: config[ConfigEnum.DB_SYNC],
    logging: false,
  } as TypeOrmModuleOptions;
}
export const connectionParams = buildConnectionOptions();
export default new DataSource({
  ...connectionParams,
  migrations: ['src/migration/**/*.ts'],
  subscribers: [],
} as DataSourceOptions);
