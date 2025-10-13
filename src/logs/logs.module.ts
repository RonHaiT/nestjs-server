import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { utilities, WinstonModule, WinstonModuleOptions } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { Console, DailyRotateFile } from 'winston/lib/winston/transports';
import { LogEnum } from '../enum/config.enum';

function createDailyRotateFileTransport(level: string, filename: string) {
  return new DailyRotateFile({
    level,
    dirname: 'logs',
    filename: `${filename}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH-mm-ss',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple(),
    ),
  });
}
@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const consoleTransports = new Console({
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            utilities.format.nestLike(),
          ),
        });

        const logOn = configService.get(LogEnum.LOG_ON);

        const shouldLogToFile = logOn === true || logOn === 'true';

        return {
          transports: [
            consoleTransports,
            ...(shouldLogToFile
              ? [
                  createDailyRotateFileTransport('info', 'application'),
                  createDailyRotateFileTransport('warn', 'error'),
                ]
              : []),
          ],
        } as WinstonModuleOptions;
      },
    }),
  ],
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {}
