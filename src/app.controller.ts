import { ConfigEnum } from './enum/config.enum';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    const dbPort = this.configService.get(ConfigEnum.DB_PORT);
    const dbUrl = this.configService.get(ConfigEnum.DB_HOST);

    return this.appService.getHello();
  }
}
