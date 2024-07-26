import { IsArray, IsOptional, IsString } from 'class-validator';

import { ProjectProposalTaskDto } from '../project_proposals_task/dto/project-proposal-task-dto';

export class CreateProjectProposalDto {
  @IsString()
  public proposed_bid = '';

  @IsString()
  public project_owner_id = '';

  @IsOptional()
  public comment? = '';

  @IsString()
  public projectId = '';

  @IsString()
  public authorId = '';

  @IsArray()
  tasks: ProjectProposalTaskDto[];
}
