import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import prisma from '../../prisma';

import { CreateProjectTaskDto } from './dto/create-project-task-dto';
import { GeneralResponse } from '../../types';

@Injectable()
export class ProjectTaskService {
  public async createMany(
    tasks: CreateProjectTaskDto[],
  ): Promise<GeneralResponse> {
    try {
      const createdTasks = await prisma.projectTask.createMany({ data: tasks });
      if (!createdTasks)
        throw new HttpException(
          'error creating many tasks',
          HttpStatus.NOT_IMPLEMENTED,
        );

      return {
        status: HttpStatus.CREATED,
        message: 'created',
        details: createdTasks,
        error: null,
      };
    } catch (e) {
      return {
        status: HttpStatus.NOT_IMPLEMENTED,
        message: 'error creating many project tasks',
        details: null,
        error: e,
      };
    }
  }

  public async getAllProjectTasks(projectId: string): Promise<GeneralResponse> {
    try {
      const tasks = await prisma.projectTask.findMany({
        where: {
          projectId,
        },
      });

      if (!tasks)
        throw new HttpException('error getting tasks', HttpStatus.BAD_REQUEST);
      return {
        status: HttpStatus.OK,
        message: 'project tasks',
        details: tasks,
        error: null,
      };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'error getting tasks',
        details: null,
        error: e,
      };
    }
  }

  public async deleteAllProjectTasksByProjectId(
    id: string,
  ): Promise<GeneralResponse> {
    try {
      const deleted = await prisma.projectTask.deleteMany({
        where: {
          projectId: id,
        },
      });
      return {
        status: HttpStatus.OK,
        message: 'all project tasks deleted',
        details: deleted,
        error: null,
      };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'error project tasks deleting',
        details: null,
        error: e,
      };
    }
  }
}
