import { Module } from '@nestjs/common';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { FileService } from '../file/file.service';
import { S3Service } from '../s3/s3.service';

@Module({
  controllers: [ContractsController],
  providers: [ContractsService, FileService, S3Service],
})
export class ContractsModule {}
