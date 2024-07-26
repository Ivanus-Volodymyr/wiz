import { Module } from '@nestjs/common';

import { ProjectTaskController } from './project_task.controller';
import { ProjectTaskService } from './project_task.service';

@Module({
  controllers: [ProjectTaskController],
  providers: [ProjectTaskService],
})
export class ProjectTaskModule {}
