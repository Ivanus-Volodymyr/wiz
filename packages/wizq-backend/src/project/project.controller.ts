import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { ProjectService } from './project.service';
import { ProjectProposalsService } from './project_proposals/project_proposals.service';
import { FileService } from '../file/file.service';

import { CreateProjectDto } from './dto/create-project-dto';
import { FileDto } from '../file/dto/file-dto';
import { GeneralResponse } from '../types';
import { InviteDTO } from './dto/invite-dto';
import { CreateProjectProposalDto } from './project_proposals/dto/create-proposal-dto';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly fileService: FileService,
    private readonly projectProposalsService: ProjectProposalsService,
  ) {}

  @Post('/create')
  @UseInterceptors(FilesInterceptor('file'))
  public async createProject(
    @UploadedFiles() files: FileDto[],
    @Body() body: CreateProjectDto,
  ): Promise<GeneralResponse> {
    return this.projectService.createProject(files, body);
  }

  @Get('/')
  public async getAllProjects(): Promise<GeneralResponse> {
    return this.projectService.getAllProjects();
  }

  @Get('/:id')
  public async getProjectById(
    @Param('id') id: string,
  ): Promise<GeneralResponse> {
    return this.projectService.getProjectById(id);
  }

  @Get('author/:id')
  public async getAllProjectsByAuthorId(
    @Param('id') id: string,
  ): Promise<GeneralResponse> {
    return this.projectService.getAllProjectsByAuthorId(id);
  }

  @Patch('/:id')
  @UseInterceptors(FilesInterceptor('file'))
  public async updateProject(
    @Param('id') id: string,
    @Body() data: Partial<CreateProjectDto>,
    @UploadedFiles() files: FileDto[],
  ): Promise<GeneralResponse> {
    return this.projectService.updateProject(id, data, files);
  }

  @Delete('/:id')
  public async deleteProject(
    @Param('id') id: string,
  ): Promise<GeneralResponse> {
    return this.projectService.deleteProject(id);
  }

  @Delete('file/:fileId')
  public async deleteProjectFile(
    @Param('fileId') id: string,
  ): Promise<GeneralResponse> {
    return this.fileService.deleteOneProjectFile(id);
  }

  @Delete('files/deleteMany')
  public async deleteProjectFilesByIds(
    @Body() body: string[],
  ): Promise<GeneralResponse> {
    return this.fileService.deleteManyProjectFilesByIds(body);
  }

  @Post('/invite')
  public async setInviteDesigner(
    @Body() invite: InviteDTO,
  ): Promise<GeneralResponse> {
    return this.projectService.setInviteDesigner(invite);
  }

  @Post('/invite/withdraw')
  public async setInviteWithdrawDesigner(
    @Body() invite: InviteDTO,
  ): Promise<GeneralResponse> {
    return this.projectService.setInviteWithdrawDesigner(invite);
  }

  @UseInterceptors(FilesInterceptor('file'))
  @Post('/proposal/create')
  public async createProjectProposal(
    @UploadedFiles() files: FileDto[],
    @Body() data: CreateProjectProposalDto,
  ) {
    return this.projectProposalsService.createProjectProposal(files, data);
  }
}
