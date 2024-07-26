import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import prisma from '../../prisma';

import { NotificationGateway } from '../../gateway/gateway';
import { NotificationsService } from '../../notifications/notifications.service';
import { ProjectProposalsTaskService } from './project_proposals_task/project_proposals_task.service';
import { FileService } from '../../file/file.service';
import { ProjectProposalsFileService } from './project_proposals_file/project_proposals_file.service';

import { GeneralResponse, NotificationType } from '../../types';
import { CreateProjectProposalDto } from './dto/create-proposal-dto';
import { FileDto } from '../../file/dto/file-dto';

@Injectable()
export class ProjectProposalsService {
  constructor(
    private readonly fileService: FileService,
    private readonly gateway: NotificationGateway,
    private readonly notificationsService: NotificationsService,
    private readonly projectProposalsTaskService: ProjectProposalsTaskService,
    private readonly projectProposalFileService: ProjectProposalsFileService,
  ) {}

  public async createProjectProposal(
    files: FileDto[],
    proposal: CreateProjectProposalDto,
  ): Promise<GeneralResponse> {
    try {
      const { tasks, ...res } = proposal;
      const createdProposal = await prisma.projectProposal.create({
        data: res,
        include: {
          project: true,
        },
      });

      if (tasks.length) {
        const data = tasks.map((value) => ({
          ...value,
          estimated_price: Number(value.estimated_price),
          projectProposalId: createdProposal.id,
        }));
        const { error } =
          await this.projectProposalsTaskService.createProjectProposalTasks(
            data,
          );
        if (error)
          throw new HttpException(
            'some error with creating project proposal tasks',
            HttpStatus.BAD_REQUEST,
          );
      }

      if (files.length) {
        const uploadedFiles = await this.fileService.uploadFiles(files);
        const filesToSaveInDb = uploadedFiles.map((file) => ({
          ...file,
          projectProposalId: createdProposal.id,
        }));
        const { error } =
          await this.projectProposalFileService.saveProjectProposalsFilesInDb(
            filesToSaveInDb,
          );
        if (error)
          throw new HttpException(
            'some error with creating project proposal files',
            HttpStatus.BAD_REQUEST,
          );
      }

      const { details } = await this.notificationsService.createNotification({
        type: NotificationType.PROPOSALS,
        message: 'project proposal notification',
        receiverId: createdProposal.project_owner_id,
        authorId: createdProposal.authorId,
        projectProposalId: createdProposal.id,
      });

      if (!createdProposal || !details) {
        throw new HttpException(
          'some error with creating proposal or notification for project',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.gateway.sendNotification(
        createdProposal.project_owner_id,
        NotificationType.PROPOSALS,
        details,
      );

      return {
        status: HttpStatus.CREATED,
        message: 'project proposal created',
        details: {
          proposal: createdProposal,
          notification: details,
        },
      };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'error  with creating proposal for project',
        error: e,
      };
    }
  }
}
