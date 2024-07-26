import { HttpStatus, Injectable } from '@nestjs/common';
import prisma from '../../../prisma';

import { GeneralResponse } from '../../../types';
import { ProjectProposalsFileDto } from './dto/project-proposals-file-dto';

@Injectable()
export class ProjectProposalsFileService {
  public async saveProjectProposalsFilesInDb(
    data: ProjectProposalsFileDto[],
  ): Promise<GeneralResponse> {
    try {
      const details = await prisma.projectProposalsFile.createMany({ data });
      return {
        status: HttpStatus.CREATED,
        message: 'created',
        details,
      };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'error with saving project proposal files in db',
        error: e,
      };
    }
  }
}
