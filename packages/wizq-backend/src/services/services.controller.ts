import { Body, Controller, Get, Post } from '@nestjs/common';
import { ServicesService } from './services.service';
import { GeneralResponse } from '../types';
import { CreateServiceDTO } from './dto/create-service-dto';
import { SuggestServicesDto } from './dto/suggest-services-dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly service: ServicesService) {}

  @Get('/')
  public async getServices(): Promise<GeneralResponse> {
    return await this.service.getServices();
  }

  @Post('/')
  public async createServices(
    @Body() service: CreateServiceDTO,
  ): Promise<GeneralResponse> {
    return await this.service.createService(service);
  }

  @Post('/suggest')
  public async suggestSkills(
    @Body() data: SuggestServicesDto,
  ): Promise<GeneralResponse> {
    return this.service.suggestServices(data);
  }
}
