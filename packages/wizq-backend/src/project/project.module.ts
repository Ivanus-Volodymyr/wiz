import { Module } from '@nestjs/common';

import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { FileModule } from '../file/file.module';
import { FileService } from '../file/file.service';
import { S3Module } from '../s3/s3.module';
import { S3Service } from '../s3/s3.service';
import { ProjectTaskModule } from './project_task/project_task.module';
import { ProjectTaskService } from './project_task/project_task.service';
import { NotificationGateway } from '../gateway/gateway';
import { NotificationsModule } from '../notifications/notifications.module';
import { NotificationsService } from '../notifications/notifications.service';
import { ProjectProposalsModule } from './project_proposals/project_proposals.module';
import { ProjectProposalsTaskModule } from './project_proposals/project_proposals_task/project_proposals_task.module';
import { ProjectProposalsFileModule } from './project_proposals/project_proposals_file/project_proposals_file.module';
import { ProjectProposalsService } from './project_proposals/project_proposals.service';
import { ProjectProposalsTaskService } from './project_proposals/project_proposals_task/project_proposals_task.service';
import { ProjectProposalsFileService } from './project_proposals/project_proposals_file/project_proposals_file.service';

@Module({
  providers: [
    ProjectService,
    FileService,
    S3Service,
    ProjectTaskService,
    ProjectProposalsService,
    NotificationGateway,
    NotificationsService,
    ProjectProposalsTaskService,
    ProjectProposalsFileService,
  ],
  controllers: [ProjectController],
  imports: [
    FileModule,
    S3Module,
    ProjectTaskModule,
    ProjectProposalsModule,
    NotificationsModule,
    ProjectProposalsTaskModule,
    ProjectProposalsFileModule,
  ],
})
export class ProjectModule {}
