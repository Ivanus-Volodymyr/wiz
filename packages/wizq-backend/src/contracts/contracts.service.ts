import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FileService } from '../file/file.service';
import { S3Service } from '../s3/s3.service';
import { GeneralResponse } from '../types';
import prisma from '../prisma';
import { FileDto } from '../file/dto/file-dto';
import { ContractsDTO } from './dto/contracts-dto';
import { Contracts, ContractsType } from '@prisma/client';
import { MilestoneDTO } from './dto/milestone-dto';
import { UploadedFileDto } from 'src/file/dto/uploaded-file-dto';

@Injectable()
export class ContractsService {
  constructor(
    private readonly fileService: FileService,
    private readonly s3Service: S3Service,
  ) {}

  public async getContractsAll(): Promise<GeneralResponse> {
    try {
      const details = await prisma.contracts.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          author: true,
          project: true,
          provider: true,
          files: true,
          milestones: {
            orderBy: {
              name: 'asc',
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

  public async getContractsByAuthId(
    authorId: string,
    contractType?: string,
  ): Promise<GeneralResponse> {
    try {
      let query: object = {};

      if (contractType) {
        if (contractType === ContractsType.MILESTONE) {
          query = {
            where: {
              authorId,
              contract_type: ContractsType.MILESTONE,
            },
          };
        }

        if (contractType === ContractsType.FIXED_RATE) {
          query = {
            where: {
              authorId,
              contract_type: ContractsType.FIXED_RATE,
            },
          };
        }

        if (contractType === ContractsType.HOURLY) {
          query = {
            where: {
              authorId,
              contract_type: ContractsType.HOURLY,
            },
          };
        }
      } else {
        query = {
          where: { authorId },
        };
      }

      const details = await prisma.contracts.findMany({
        ...query,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          author: true,
          project: true,
          provider: { include: { Business: true } },
          files: true,
          milestones: {
            orderBy: {
              name: 'asc',
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

  public async getContractsById(id: string): Promise<GeneralResponse> {
    try {
      const details = await prisma.contracts.findUnique({
        where: { id },
        include: {
          author: true,
          project: true,
          provider: true,
          files: true,
          milestones: {
            orderBy: {
              name: 'asc',
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

  public async setContractsData(
    files: FileDto[],
    contract: ContractsDTO,
  ): Promise<GeneralResponse> {
    let contractData: Contracts = null;

    try {
      const existData = await prisma.contracts.findUnique({
        where: { id: contract.id },
      });

      // Contracts general step
      if (contract.name && contract.name !== '') {
        const randomValue = Math.floor(Math.random() * 10000000) + 1;

        contractData = await prisma.contracts.upsert({
          where: {
            id: existData ? existData.id : '',
          },
          create: {
            author: {
              connect: {
                id: contract.authorId,
              },
            },
            project: {
              connect: {
                id: contract.projectId,
              },
            },
            provider: {
              connect: {
                id: contract.providerId,
              },
            },
            contractId: randomValue.toString(),
            name: contract.name,
            description: contract.description,
            start_date: contract.start_date,
            end_date: contract.end_date,
            contract_type: contract.contract_type,
          },
          update: {
            project: {
              connect: {
                id: contract.projectId,
              },
            },
            provider: {
              connect: {
                id: contract.providerId,
              },
            },
            name: contract.name,
            description: contract.description,
            start_date: contract.start_date,
            end_date: contract.end_date,
            contract_type: contract.contract_type,
          },
        });
      }

      if (
        !contractData &&
        contract.name &&
        contract.name !== '' &&
        !existData
      ) {
        throw new HttpException(
          'Something went wrong with action.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Contracts payment step
      if (contract.contract_type === ContractsType.MILESTONE) {
        if (
          contract.contract_amount &&
          parseFloat(contract.contract_amount) !== 0
        ) {
          contractData = await prisma.contracts.update({
            where: { id: existData?.id },
            data: {
              contract_amount: parseFloat(contract.contract_amount),
            },
          });

          if (contract.milestones && contract.milestones.length !== 0) {
            await prisma.milestonesOnContracts.deleteMany({
              where: { contractId: contractData?.id },
            });

            contract.milestones.filter(async (rs: string) => {
              const value = JSON.parse(rs) as MilestoneDTO;

              await prisma.milestonesOnContracts.create({
                data: {
                  contract: {
                    connect: {
                      id: existData?.id,
                    },
                  },
                  name: value.name,
                  amount: parseFloat(value.amount),
                },
              });
            });
          }
        }
      }

      if (contract.contract_type === ContractsType.FIXED_RATE) {
        if (contract.payment_rate && parseFloat(contract.payment_rate) !== 0) {
          contractData = await prisma.contracts.update({
            where: { id: existData?.id },
            data: {
              payment_rate: parseFloat(contract.payment_rate),
              payment_frequency: contract.payment_frequency,
              invoice_cycle_ends: contract.invoice_cycle_ends,
              payment_due_date: contract.payment_due_date,
              payment_first_day: contract.payment_first_day,
              payment_amount: parseFloat(contract.payment_amount),
            },
          });
        }
      }

      if (contract.contract_type === ContractsType.HOURLY) {
        if (
          contract.contract_amount &&
          parseFloat(contract.contract_amount) !== 0
        ) {
          contractData = await prisma.contracts.update({
            where: { id: existData?.id },
            data: {
              contract_amount: parseFloat(contract.contract_amount),
              hourly_rate: parseFloat(contract.hourly_rate),
              weekly_limit: parseFloat(contract.weekly_limit),
            },
          });
        }
      }

      // Contracts compliance step
      if (contract.termination_date && contract.termination_date !== '') {
        contractData = await prisma.contracts.update({
          where: { id: existData?.id },
          data: {
            termination_date: contract.termination_date,
            notice_period: parseFloat(contract.notice_period),
            period_unit: contract.period_unit,
          },
        });

        if (files && files?.length !== 0) {
          const uploadedFiles = await this.fileService.uploadFiles(files);

          await Promise.all(
            uploadedFiles.filter(async (rs: UploadedFileDto) => {
              await prisma.contractsFile.create({
                data: {
                  ...rs,
                  contract: {
                    connect: {
                      id: existData ? existData.id : contractData.id,
                    },
                  },
                },
              });
            }),
          );
        }
      }

      const details = await prisma.contracts.findUnique({
        where: { id: existData ? existData.id : contractData?.id },
        include: {
          project: true,
          provider: true,
          files: true,
          milestones: {
            orderBy: {
              name: 'asc',
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

  public async updateContractsData(
    contractId: string,
    files: FileDto[],
    contract: ContractsDTO,
  ): Promise<GeneralResponse> {
    let contractData: Contracts = null;

    try {
      // Contracts general step
      if (contract.name && contract.name !== '') {
        contractData = await prisma.contracts.update({
          where: {
            id: contractId,
          },
          data: {
            project: {
              connect: {
                id: contract.projectId,
              },
            },
            provider: {
              connect: {
                id: contract.providerId,
              },
            },
            name: contract.name,
            description: contract.description,
            start_date: contract.start_date,
            end_date: contract.end_date,
            contract_type: contract.contract_type,
          },
        });
      }

      if (!contractData && contract.name && contract.name !== '') {
        throw new HttpException(
          'Something went wrong with action.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Contracts payment step
      if (
        contract.contract_amount &&
        parseFloat(contract.contract_amount) !== 0
      ) {
        if (contract.contract_type === ContractsType.MILESTONE) {
          contractData = await prisma.contracts.update({
            where: { id: contractId },
            data: {
              contract_amount: parseFloat(contract.contract_amount),
            },
          });

          if (contract.milestones && contract.milestones.length !== 0) {
            await prisma.milestonesOnContracts.deleteMany({
              where: { contractId },
            });

            contract.milestones.filter(async (rs: string) => {
              const value = JSON.parse(rs) as MilestoneDTO;

              await prisma.milestonesOnContracts.create({
                data: {
                  contract: {
                    connect: {
                      id: contractData?.id,
                    },
                  },
                  name: value.name,
                  amount: parseFloat(value.amount),
                },
              });
            });
          }
        }
      }

      // Contracts compliance step
      if (contract.termination_date && contract.termination_date !== '') {
        contractData = await prisma.contracts.update({
          where: { id: contractId },
          data: {
            termination_date: contract.termination_date,
            notice_period: parseFloat(contract.notice_period),
            period_unit: contract.period_unit,
          },
        });

        if (files && files?.length !== 0) {
          const uploadedFiles = await this.fileService.uploadFiles(files);

          await Promise.all(
            uploadedFiles.filter(async (rs: UploadedFileDto) => {
              await prisma.contractsFile.create({
                data: {
                  ...rs,
                  contract: {
                    connect: {
                      id: contractId,
                    },
                  },
                },
              });
            }),
          );
        }
      }

      return {
        status: HttpStatus.OK,
        message: 'Successed',
        details: contractData,
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

  public async deleteFileById(id: string): Promise<GeneralResponse> {
    try {
      const data = await prisma.contractsFile.delete({
        where: { id },
      });

      const fileKeyInAws = data.fileUrl.split('/').slice(3).join('/');
      await this.s3Service.deleteProjectFileFromAws(fileKeyInAws);

      const details = await prisma.contractsFile.findMany({
        where: { contractId: data.contractId },
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

  public async deleteIncompleteContracts(
    authorId: string,
  ): Promise<GeneralResponse> {
    try {
      const data = await prisma.contracts.findMany({
        where: { authorId },
      });

      if (data && data?.length) {
        await Promise.all(
          data?.filter(async (rs: Contracts) => {
            if (rs.contract_type === ContractsType.MILESTONE) {
              if (
                !rs.projectId ||
                !rs.contract_amount ||
                !rs.termination_date
              ) {
                await prisma.milestonesOnContracts.deleteMany({
                  where: { contractId: rs.id },
                });

                await prisma.contracts.delete({ where: { id: rs.id } });
              }
            }

            if (rs.contract_type === ContractsType.FIXED_RATE) {
              if (!rs.projectId || !rs.payment_rate || !rs.termination_date) {
                await prisma.contracts.delete({ where: { id: rs.id } });
              }
            }

            if (rs.contract_type === ContractsType.HOURLY) {
              if (
                !rs.projectId ||
                !rs.contract_amount ||
                !rs.termination_date
              ) {
                await prisma.contracts.delete({ where: { id: rs.id } });
              }
            }
          }),
        );
      }

      return {
        status: HttpStatus.OK,
        message: 'Successed',
        details: [],
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
