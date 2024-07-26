import { HttpStatus, Injectable } from '@nestjs/common';
import { GeneralResponse } from '../types';
import prisma from '../prisma';
import { CreateServiceDTO } from './dto/create-service-dto';
import { Services } from '@prisma/client';
import { nlp } from '../utils/nlp';
import { SuggestServicesDto } from './dto/suggest-services-dto';

@Injectable()
export class ServicesService {
  public async getServices(): Promise<GeneralResponse> {
    try {
      const services = await prisma.services.findMany();
      const details = services.map((rs: Services) => {
        return {
          id: rs.id,
          name: rs.name,
        };
      });

      return {
        status: HttpStatus.OK,
        message: 'Successed',
        details,
      };
    } catch (error) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Something went wrong!',
        error,
      };
    }
  }

  public async createService(
    param: CreateServiceDTO,
  ): Promise<GeneralResponse> {
    try {
      const details = await prisma.services.create({
        data: param,
      });

      if (!details)
        throw new Error('Something went wrong with creating service data');

      return {
        status: HttpStatus.CREATED,
        message: 'Successed',
        details: { id: details.id, name: details.name },
      };
    } catch (error) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Something went wrong with getting service data',
        error,
      };
    }
  }

  public async suggestServices(
    data: SuggestServicesDto,
  ): Promise<GeneralResponse> {
    try {
      const allServices = await prisma.services.findMany();
      const { services } = data;

      const description = services.join(' ');

      const suggestedServices = nlp(allServices, description, 'partial');

      const response = {
        suggestedServices,
      };

      return {
        status: HttpStatus.OK,
        message: 'suggested services',
        details: response,
        error: null,
      };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'error getting services',
        details: null,
        error: e,
      };
    }
  }
}
