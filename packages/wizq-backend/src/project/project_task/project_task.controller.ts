import { Controller, Get, Param } from '@nestjs/common';

import { ProjectTaskService } from './project_task.service';
import { GeneralResponse } from '../../types';

@Controller('project-tasks')
export class ProjectTaskController {
  constructor(private readonly projectTaskService: ProjectTaskService) {}
  @Get('project/:id')
  public async getProjectTasks(
    @Param('id') id: string,
  ): Promise<GeneralResponse> {
    return this.projectTaskService.getAllProjectTasks(id);
  }
}
