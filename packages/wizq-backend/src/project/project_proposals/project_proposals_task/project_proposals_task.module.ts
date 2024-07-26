import { Module } from '@nestjs/common';

import { ProjectProposalsTaskService } from './project_proposals_task.service';

@Module({
  controllers: [],
  providers: [ProjectProposalsTaskService],
})
export class ProjectProposalsTaskModule {}
