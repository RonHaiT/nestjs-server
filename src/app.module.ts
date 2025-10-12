import { Global, Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { LogsModule } from './logs/logs.module';
import { connectionParams } from './typeorm-cli.datasource';

const envFilePath = `.env.${process.env.NODE_ENV}`;
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath, // 数组形式
      load: [() => dotenv.config({ path: '.env' })],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        DB_TYPE: Joi.string().valid('mysql', 'postgres'),
        DB_PORT: Joi.number().default(3306),
        DB_HOST: Joi.alternatives().try(
          Joi.string().ip(),
          Joi.string().domain(),
          Joi.string().valid('localhost'),
        ),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        DB_SYNC: Joi.boolean().default(false),
        LOG_LEVEL: Joi.string().valid('debug', 'info', 'warn', 'error'),
        LOG_ON: Joi.boolean().default(false),
      }),
    }),
    TypeOrmModule.forRoot(connectionParams),
    UserModule,
    RoleModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
  exports: [Logger],
})
export class AppModule {}
