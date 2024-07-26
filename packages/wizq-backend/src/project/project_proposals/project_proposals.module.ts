import { Module } from '@nestjs/common';

import { ProjectProposalsService } from './project_proposals.service';
import { ProjectProposalsTaskModule } from './project_proposals_task/project_proposals_task.module';
import { ProjectProposalsTaskService } from './project_proposals_task/project_proposals_task.service';
import { ProjectProposalsFileModule } from './project_proposals_file/project_proposals_file.module';
import { ProjectProposalsFileService } from './project_proposals_file/project_proposals_file.service';
import { GatewayModule } from '../../gateway/gateway.module';
import { NotificationsModule } from '../../notifications/notifications.module';
import { FileModule } from '../../file/file.module';
import { S3Module } from '../../s3/s3.module';
import { NotificationGateway } from '../../gateway/gateway';
import { NotificationsService } from '../../notifications/notifications.service';
import { FileService } from '../../file/file.service';
import { S3Service } from '../../s3/s3.service';

@Module({
  imports: [
    GatewayModule,
    NotificationsModule,
    ProjectProposalsTaskModule,
    FileModule,
    S3Module,
    ProjectProposalsFileModule,
  ],
  providers: [
    ProjectProposalsService,
    NotificationGateway,
    NotificationsService,
    ProjectProposalsTaskService,
    FileService,
    S3Service,
    ProjectProposalsFileService,
  ],
})
export class ProjectProposalsModule {}
