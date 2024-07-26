import { Module } from '@nestjs/common';

import { FileService } from './file.service';
import { S3Module } from '../s3/s3.module';
import { S3Service } from '../s3/s3.service';

@Module({
  providers: [FileService, S3Service],
  controllers: [],
  imports: [S3Module],
})
export class FileModule {}
