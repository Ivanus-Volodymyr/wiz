import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';

import { TestEntityService } from './testEntity.service';
import { SentryInterceptor } from '../sentry/sentry.interceptor';
import { AuthGuard } from '../auth/auth.guard';

@UseInterceptors(SentryInterceptor)
@Controller('/test-entities')
export class TestEntityController {
  constructor(private readonly testEntityService: TestEntityService) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async getTestEntities() {
    return this.testEntityService.getTestEntities();
  }
}
