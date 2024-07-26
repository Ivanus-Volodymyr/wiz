import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { GeneralResponse } from 'src/types';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BusinessDTO } from './dto/business-dto';
import { BusinessProjectDTO } from './dto/project-dto';
import { FileDto } from '../file/dto/file-dto';

@Controller('business')
export class BusinessController {
  constructor(private readonly service: BusinessService) {}

  @Get('/')
  public async getBusinessData(
    @Query('id') id?: string,
    @Query('authId') authId?: string,
  ): Promise<GeneralResponse> {
    if (id) {
      return await this.service.getBusinessById(id);
    }

    if (authId) {
      return await this.service.getBusinessByAuthId(authId);
    }

    return await this.service.getBusinessAll();
  }

  @Post('/')
  public async setBusiness(
    @Body() business: BusinessDTO,
  ): Promise<GeneralResponse> {
    return await this.service.setBusinessData(business);
  }

  @Post('/project/:businessId')
  @UseInterceptors(FilesInterceptor('files'))
  public async createProject(
    @UploadedFiles() files: FileDto[],
    @Param('businessId') businessId: string,
    @Body() project: BusinessProjectDTO,
  ): Promise<GeneralResponse> {
    return this.service.createProject(files, businessId, project);
  }

  @Patch('/project/:projectId')
  @UseInterceptors(FilesInterceptor('files'))
  public async updateProject(
    @UploadedFiles() files: FileDto[],
    @Param('projectId') projectId: string,
    @Body() project: BusinessProjectDTO,
  ): Promise<GeneralResponse> {
    return this.service.updateProject(files, projectId, project);
  }

  @Delete('/project/:id/file')
  public async deleteFileById(
    @Param('id') id: string,
  ): Promise<GeneralResponse> {
    return this.service.deleteFileById(id);
  }

  @Delete('/project/:id')
  public async deleteProjectById(
    @Param('id') id: string,
  ): Promise<GeneralResponse> {
    return this.service.deleteProjectById(id);
  }
}
