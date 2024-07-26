import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestEntityModule } from './testEntity/testEntity.module';
import { TestEntityService } from './testEntity/testEntity.service';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/auth.service';
import { ProjectModule } from './project/project.module';
import { FileModule } from './file/file.module';
import { S3Module } from './s3/s3.module';
import { CategoryModule } from './category/category.module';
import { SkillModule } from './skill/skill.module';
import { HttpModule } from '@nestjs/axios';
import { ServicesModule } from './services/services.module';
import { BusinessModule } from './business/business.module';
import { ContractsModule } from './contracts/contracts.module';
import { GatewayModule } from './gateway/gateway.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ProjectProposalsModule } from './project/project_proposals/project_proposals.module';
import { ProjectProposalsTaskModule } from './project/project_proposals/project_proposals_task/project_proposals_task.module';
import { ProjectProposalsFileModule } from './project/project_proposals/project_proposals_file/project_proposals_file.module';
import { ProjectTaskModule } from './project/project_task/project_task.module';

if (!process.env.SENTRY_DSN) {
  console.warn('SENTRY_DSN is not set, Sentry will not be initialized');
}

@Module({
  imports: [
    HttpModule,
    TestEntityModule,
    UserModule,
    ProjectModule,
    FileModule,
    S3Module,
    CategoryModule,
    SkillModule,
    ProjectTaskModule,
    ServicesModule,
    BusinessModule,
    ContractsModule,
    GatewayModule,
    ProjectProposalsModule,
    NotificationsModule,
    ProjectProposalsTaskModule,
    ProjectProposalsFileModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, TestEntityService, UserService],
})
export class AppModule {}
