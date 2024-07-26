import { Module } from '@nestjs/common';

import { ProjectProposalsFileService } from './project_proposals_file.service';

@Module({
  providers: [ProjectProposalsFileService],
  exports: [ProjectProposalsFileService],
})
export class ProjectProposalsFileModule {}
