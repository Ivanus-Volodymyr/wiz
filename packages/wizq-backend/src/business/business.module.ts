import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { validateCreateOrUpdate } from './business.middleware';
import { FileModule } from '../file/file.module';
import { FileService } from '../file/file.service';
import { S3Module } from '../s3/s3.module';
import { S3Service } from '../s3/s3.service';

@Module({
  controllers: [BusinessController],
  providers: [BusinessService, FileService, S3Service],
  imports: [FileModule, S3Module],
})
export class BusinessModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(validateCreateOrUpdate)
      .forRoutes({ path: 'business', method: RequestMethod.POST });
  }
}
