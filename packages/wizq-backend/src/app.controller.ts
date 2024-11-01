import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { SentryInterceptor } from './sentry/sentry.interceptor';

@UseInterceptors(SentryInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): { msg: string } {
    return this.appService.getHello();
  }
}
