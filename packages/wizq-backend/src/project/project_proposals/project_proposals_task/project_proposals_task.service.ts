import { HttpStatus, Injectable } from '@nestjs/common';
import prisma from '../../../prisma';

import { CreateProjectProposalTaskDto } from './dto/create-project-proposal-task-dto';
import { GeneralResponse } from '../../../types';

@Injectable()
export class ProjectProposalsTaskService {
  public async createProjectProposalTasks(
    data: CreateProjectProposalTaskDto[],
  ): Promise<GeneralResponse> {
    try {
      const details = await prisma.projectProposalsTask.createMany({
        data,
      });

      return {
        status: HttpStatus.CREATED,
        message: 'successfully created',
        details,
      };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'error creating project proposal tasks',
        error: e,
      };
    }
  }
}
