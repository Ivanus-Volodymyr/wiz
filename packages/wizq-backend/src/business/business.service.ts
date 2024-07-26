import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import prisma from 'src/prisma';
import { GeneralResponse } from 'src/types';
import { BusinessDTO } from './dto/business-dto';
import { Business, Category, Services, UserSubType } from '@prisma/client';
import { BusinessProjectDTO } from './dto/project-dto';
import { FileDto } from '../file/dto/file-dto';
import { FileService } from '../file/file.service';
import { UploadedFileDto } from '../file/dto/uploaded-file-dto';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class BusinessService {
  constructor(
    private readonly fileService: FileService,
    private readonly s3Service: S3Service,
  ) {}

  public async getBusinessAll(): Promise<GeneralResponse> {
    try {
      const details = await prisma.business.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          author: true,
          categories: true,
          services: true,
          location: true,
          businessProjects: {
            include: {
              files: true,
              businessCategories: true,
            },
          },
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'Successed',
        details,
      };
    } catch (error: any) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: error
          ? error?.response
            ? error?.response
            : 'Something went wrong!'
          : 'Something went wrong!',
        error,
      };
    }
  }

  public async getBusinessByAuthId(authorId: string): Promise<GeneralResponse> {
    try {
      const details = await prisma.business.findFirst({
        where: { authorId },
        include: {
          author: true,
          categories: true,
          services: true,
          location: true,
          businessProjects: {
            include: {
              files: true,
              businessCategories: true,
            },
          },
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'Successed',
        details,
      };
    } catch (error: any) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: error
          ? error?.response
            ? error?.response
            : 'Something went wrong!'
          : 'Something went wrong!',
        error,
      };
    }
  }

  public async getBusinessById(id: string): Promise<GeneralResponse> {
    try {
      const details = await prisma.business.findUnique({
        where: { id },
        include: {
          author: true,
          categories: true,
          services: {
            include: {
              service: true,
            },
          },
          location: true,
          businessProjects: {
            include: {
              files: true,
              businessCategories: true,
            },
          },
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'Successed',
        details,
      };
    } catch (error: any) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: error
          ? error?.response
            ? error?.response
            : 'Something went wrong!'
          : 'Something went wrong!',
        error,
      };
    }
  }

  public async setBusinessData(
    business: BusinessDTO,
  ): Promise<GeneralResponse> {
    let businessData: Business = null;

    try {
      const existData = await prisma.business.findFirst({
        where: { authorId: business.authorId },
        include: {
          categories: true,
          services: true,
          location: true,
        },
      });

      // Business overflow
      if (business.name && business.name !== '') {
        businessData = await prisma.business.upsert({
          where: {
            id: existData ? existData.id : '',
          },
          create: {
            author: {
              connect: {
                id: business.authorId,
              },
            },
            name: business.name,
            description: business.description,
            license: business.license,
            employee_cnt: business.employee_cnt,
          },
          update: {
            name: business.name,
            description: business.description,
            license: business.license,
            employee_cnt: business.employee_cnt,
          },
        });
      }

      if (!businessData && business.name && business.name !== '') {
        throw new HttpException(
          'Something went wrong with action.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (business.categories && business.categories.length !== 0) {
        await prisma.categoriesOnBusinesses.deleteMany({
          where: { businessId: businessData.id },
        });

        await Promise.all(
          business.categories.filter(async (rs: Category) => {
            await prisma.categoriesOnBusinesses.create({
              data: {
                business: {
                  connect: {
                    id: businessData.id,
                  },
                },
                category: {
                  connect: {
                    id: rs.id,
                  },
                },
              },
            });
          }),
        );
      }

      // Business services
      if (business.services && business.services.length !== 0) {
        await prisma.servicesOnBusinesses.deleteMany({
          where: { businessId: existData ? existData.id : businessData.id },
        });

        const resService = await Promise.all(
          business.services.map(async (rs: Services) => {
            const serviceData = await prisma.servicesOnBusinesses.create({
              data: {
                business: {
                  connect: {
                    id: existData ? existData.id : businessData.id,
                  },
                },
                service: {
                  connect: {
                    id: rs.id,
                  },
                },
              },
              include: {
                service: true,
              },
            });

            return {
              id: serviceData?.serviceId,
              isDesigner: serviceData?.service?.isDesigner,
            };
          }),
        );

        const findDesigner = resService?.find((rs) => rs.isDesigner);

        if (findDesigner) {
          await prisma.user.update({
            where: {
              id: business.authorId,
            },
            data: {
              subType: UserSubType.DESIGNER,
            },
          });
        } else {
          await prisma.user.update({
            where: {
              id: business.authorId,
            },
            data: {
              subType: UserSubType.PROVIDER,
            },
          });
        }
      }

      // Business location
      if (business.country && business.country !== '') {
        await prisma.locationOnBusiness.upsert({
          where: {
            id: existData
              ? existData.location.length !== 0
                ? existData.location[0].id
                : ''
              : '',
          },
          create: {
            business: {
              connect: {
                id: existData ? existData.id : businessData.id,
              },
            },
            country: business.country,
            state: business.state,
            address: business.address,
            city: business.city,
            zipcode: business.zipcode,
          },
          update: {
            country: business.country,
            state: business.state,
            address: business.address,
            city: business.city,
            zipcode: business.zipcode,
          },
        });
      }

      // Business Reach
      if (business.like_location && business.like_location.length !== 0) {
        await prisma.business.updateMany({
          where: { authorId: business.authorId },
          data: {
            like_location: business.like_location.toString(),
          },
        });
      }

      // Business hourly rate
      if (business.hourly_rate) {
        await prisma.business.updateMany({
          where: { authorId: business.authorId },
          data: {
            hourly_rate: parseFloat(business.hourly_rate),
          },
        });
      }

      const details = await prisma.business.findUnique({
        where: { id: existData ? existData.id : businessData.id },
        include: {
          categories: true,
          services: true,
          location: true,
          businessProjects: true,
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'Successed',
        details,
      };
    } catch (error: any) {
      console.log({ error });

      return {
        status: HttpStatus.BAD_REQUEST,
        message: error
          ? error?.response
            ? error?.response
            : 'Something went wrong!'
          : 'Something went wrong!',
        error,
      };
    }
  }

  public async createProject(
    files: FileDto[],
    businessId: string,
    project: BusinessProjectDTO,
  ): Promise<GeneralResponse> {
    try {
      const projectData = await prisma.businessProject.create({
        data: {
          business: {
            connect: {
              id: businessId,
            },
          },
          name: project.name,
          location: project.location,
        },
      });

      if (!projectData) {
        throw new HttpException(
          'Something went wrong with create.',
          HttpStatus.BAD_REQUEST,
        );
      }

      await prisma.categoryOnBusinessProject.deleteMany({
        where: { projectId: projectData?.id },
      });

      await Promise.all(
        project.categories.filter(async (rs: string) => {
          const value = JSON.parse(rs) as Category;

          await prisma.categoryOnBusinessProject.create({
            data: {
              businessProject: {
                connect: {
                  id: projectData?.id,
                },
              },
              category: {
                connect: {
                  id: value.id,
                },
              },
            },
          });
        }),
      );

      if (files && files?.length !== 0) {
        const uploadedFiles = await this.fileService.uploadFiles(files);

        await Promise.all(
          uploadedFiles.filter(async (rs: UploadedFileDto) => {
            await prisma.projectFileOnBusiness.create({
              data: {
                ...rs,
                businessProject: {
                  connect: {
                    id: projectData?.id,
                  },
                },
              },
            });
          }),
        );
      }

      const details = await prisma.businessProject.findUnique({
        where: { id: projectData.id },
        include: {
          files: true,
          business: true,
          businessCategories: true,
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'Successed',
        details,
      };
    } catch (error: any) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error
          ? error?.response
            ? error?.response
            : 'Something went wrong!'
          : 'Something went wrong!',
        error,
      };
    }
  }

  public async updateProject(
    files: FileDto[],
    projectId: string,
    project: BusinessProjectDTO,
  ): Promise<GeneralResponse> {
    try {
      const projectData = await prisma.businessProject.update({
        where: { id: projectId },
        data: {
          name: project.name,
          location: project.location,
        },
      });

      if (!projectData) {
        throw new HttpException(
          'Something went wrong with update.',
          HttpStatus.BAD_REQUEST,
        );
      }

      await prisma.categoryOnBusinessProject.deleteMany({
        where: { projectId },
      });

      await Promise.all(
        project.categories.filter(async (rs: string) => {
          const value = JSON.parse(rs) as Category;

          await prisma.categoryOnBusinessProject.create({
            data: {
              businessProject: {
                connect: {
                  id: projectData?.id,
                },
              },
              category: {
                connect: {
                  id: value.id,
                },
              },
            },
          });
        }),
      );

      if (files && files?.length !== 0) {
        const uploadedFiles = await this.fileService.uploadFiles(files);

        await Promise.all(
          uploadedFiles.filter(async (rs: UploadedFileDto) => {
            await prisma.projectFileOnBusiness.create({
              data: {
                ...rs,
                businessProject: {
                  connect: {
                    id: projectData?.id,
                  },
                },
              },
            });
          }),
        );
      }

      const details = await prisma.businessProject.findUnique({
        where: { id: projectId },
        include: {
          files: true,
          business: true,
          businessCategories: true,
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'Successed',
        details,
      };
    } catch (error: any) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error
          ? error?.response
            ? error?.response
            : 'Something went wrong!'
          : 'Something went wrong!',
        error,
      };
    }
  }

  public async deleteFileById(id: string): Promise<GeneralResponse> {
    try {
      const data = await prisma.projectFileOnBusiness.delete({
        where: { id },
      });

      const fileKeyInAws = data.fileUrl.split('/').slice(3).join('/');
      await this.s3Service.deleteProjectFileFromAws(fileKeyInAws);

      const details = await prisma.projectFileOnBusiness.findMany({
        where: { projectId: data.projectId },
      });

      return {
        status: HttpStatus.OK,
        message: 'Successed',
        details,
      };
    } catch (error: any) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error
          ? error?.response
            ? error?.response
            : 'Something went wrong!'
          : 'Something went wrong!',
        error,
      };
    }
  }
  public async deleteProjectById(id: string): Promise<GeneralResponse> {
    try {
      const data = await prisma.businessProject.delete({
        where: { id },
      });

      const details = await prisma.projectFileOnBusiness.findMany({
        where: { projectId: data.id },
      });

      return {
        status: HttpStatus.OK,
        message: 'Successed',
        details,
      };
    } catch (error: any) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error
          ? error?.response
            ? error?.response
            : 'Something went wrong!'
          : 'Something went wrong!',
        error,
      };
    }
  }
}
