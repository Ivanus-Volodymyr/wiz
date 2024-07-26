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
import { ContractsService } from './contracts.service';
import { GeneralResponse } from '../types';
import { ContractsDTO } from './dto/contracts-dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileDto } from '../file/dto/file-dto';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly service: ContractsService) {}

  @Get('/')
  public async getContractsData(
    @Query('id') id?: string,
    @Query('authId') authId?: string,
    @Query('contractType') contractType?: string,
  ): Promise<GeneralResponse> {
    if (id) {
      return await this.service.getContractsById(id);
    }

    if (authId) {
      return await this.service.getContractsByAuthId(authId, contractType);
    }

    return await this.service.getContractsAll();
  }

  @Post('/')
  @UseInterceptors(FilesInterceptor('files'))
  public async setContracts(
    @UploadedFiles() files: FileDto[],
    @Body() contract: ContractsDTO,
  ): Promise<GeneralResponse> {
    return this.service.setContractsData(files, contract);
  }

  @Patch('/:contractId')
  @UseInterceptors(FilesInterceptor('files'))
  public async updateContracts(
    @UploadedFiles() files: FileDto[],
    @Param('contractId') contractId: string,
    @Body() contract: ContractsDTO,
  ): Promise<GeneralResponse> {
    return this.service.updateContractsData(contractId, files, contract);
  }

  @Delete('/file/:id')
  public async deleteFileById(
    @Param('id') id: string,
  ): Promise<GeneralResponse> {
    return this.service.deleteFileById(id);
  }

  @Delete('/:authorId')
  public async deleteIncompleteContracts(
    @Param('authorId') authorId?: string,
  ): Promise<GeneralResponse> {
    return this.service.deleteIncompleteContracts(authorId);
  }
}
