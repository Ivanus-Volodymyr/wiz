import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import prisma from '../prisma';

import { NotificationsService } from '../notifications/notifications.service';
import { NotificationGateway } from '../gateway/gateway';
import { ProjectTaskService } from './project_task/project_task.service';

import { CreateProjectDto } from './dto/create-project-dto';
import { FileService } from '../file/file.service';
import { FileDto } from '../file/dto/file-dto';
import { GeneralResponse, NotificationType } from '../types';
import { InviteDTO } from './dto/invite-dto';

@Injectable()
export class ProjectService {
  constructor(
    private readonly fileService: FileService,
    private readonly projectTaskService: ProjectTaskService,
    private readonly notificationsService: NotificationsService,
    private readonly gateway: NotificationGateway,
  ) {}

  public async createProject(
    files: FileDto[],
    project: CreateProjectDto,
  ): Promise<GeneralResponse> {
    try {
      const existingProjectByName = await prisma.project.findFirst({
        where: {
          AND: [
            {
              authorId: project.authorId,
            },
            {
              name: project.name,
            },
          ],
        },
      });
      if (existingProjectByName)
        throw new BadRequestException('Project with this name already exists');

      const { categories, skills, dimensions, ...rest } = project;
      const createdProject = await prisma.project.create({
        data: {
          name: rest.name,
          description: rest.description,
          address: rest.address,
          start_date: rest.start_date,
          is_private: !!rest.is_private,
          authorId: rest.authorId,
          skill_level: rest.skill_level,
          min_budget: rest.min_budget,
          max_budget: rest.max_budget,
          categories: categories && {
            create: categories.map((categoryId) => ({
              category: {
                connect: {
                  id: categoryId,
                },
              },
            })),
          },
          skills: skills && {
            create: skills.map((skillId) => ({
              skill: {
                connect: {
                  id: skillId,
                },
              },
            })),
          },
        },
      });

      if (dimensions) {
        await prisma.projectDimension.create({
          data: {
            projectId: createdProject.id,
            length: Number(dimensions.length),
            width: Number(dimensions.width),
            unit: Number(dimensions.unit),
            result: Number(dimensions.result),
          },
        });
      }

      if (files.length) {
        const uploadedFiles = await this.fileService.uploadFiles(files);
        const filesToSaveInDb = uploadedFiles.map((file) => ({
          ...file,
          projectId: createdProject.id,
        }));

        await this.fileService.saveProjectFilesInDb(filesToSaveInDb);
      }
      return {
        status: HttpStatus.CREATED,
        message: 'created',
        details: createdProject,
        error: null,
      };
    } catch (e: unknown) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'error with creating project',
        details: null,
        error: e,
      };
    }
  }

  public async getAllProjects(): Promise<GeneralResponse> {
    try {
      const projects = await prisma.project.findMany();
      return {
        status: HttpStatus.OK,
        message: 'projects',
        details: projects,
        error: null,
      };
    } catch (e) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'error with getting projects',
        details: null,
        error: e,
      };
    }
  }

  public async getAllProjectsByAuthorId(
    authorId: string,
  ): Promise<GeneralResponse> {
    try {
      const uniqueProjects = await prisma.project.findMany({
        where: {
          authorId,
        },
        include: {
          contracts: true,
          projectInvitation: {
            include: {
              provider: {
                include: {
                  Business: true,
                },
              },
            },
          },
          proposals: true,
        },
      });

      if (!uniqueProjects.length)
        throw new HttpException(
          `not found any projects with author id ${authorId}`,
          HttpStatus.NOT_FOUND,
        );

      return {
        status: 200,
        message: 'found',
        details: uniqueProjects,
        error: null,
      };
    } catch (e) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'projects not found',
        details: null,
        error: e,
      };
    }
  }

  public async getProjectById(id: string): Promise<GeneralResponse> {
    try {
      const uniqueProject = await prisma.project.findUnique({
        where: {
          id,
        },
        include: {
          dimensions: true,
          files: true,
          author: true,
          tasks: true,
          proposals: {
            include: {
              author: {
                include: {
                  Business: {
                    include: {
                      services: {
                        select: {
                          service: true,
                        },
                      },
                    },
                  },
                },
              },
              tasks: true,
              files: true,
            },
          },
          projectInvitation: {
            include: {
              provider: true,
            },
          },
          categories: {
            select: {
              category: true,
            },
          },
          skills: {
            select: {
              skill: true,
            },
          },
        },
      });

      if (!uniqueProject)
        throw new HttpException(
          `not found any project with id ${id}`,
          HttpStatus.NOT_FOUND,
        );

      const projectSkillsNames = uniqueProject.skills.map(
        (skill) => skill.skill.name,
      );
      const projectCategoriesNames = uniqueProject.categories.map(
        (category) => category.category.name,
      );

      const matchedRes = await this.getProjectMatchedProviders(
        projectCategoriesNames,
        projectSkillsNames,
        id,
      );

      const contactedRes = await this.getProjectContactedProviders(id);

      return {
        status: 200,
        message: 'found',
        details: {
          ...uniqueProject,
          categories: uniqueProject?.categories.map(
            (category) => category.category,
          ),
          skills: uniqueProject?.skills.map((skill) => skill.skill),
          matched: matchedRes.details,
          contacted: contactedRes.details,
        },
      };
    } catch (e) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'project not found',
        details: null,
        error: e,
      };
    }
  }

  public async updateProject(
    id: string,
    dataToUpdate: Partial<CreateProjectDto>,
    files: FileDto[],
  ): Promise<GeneralResponse> {
    try {
      const project = await prisma.project.findUnique({
        where: {
          id,
        },
      });
      if (!project) {
        throw new NotFoundException(`Project with id ${id} not found`);
      }

      const { project_tasks, dimensions, ...res } = dataToUpdate;

      if (files) {
        const uploadedFiles = await this.fileService.uploadFiles(files);
        const filesToSaveInDb = uploadedFiles.map((file) => ({
          ...file,
          projectId: id,
        }));
        const savedFiles = await this.fileService.saveProjectFilesInDb(
          filesToSaveInDb,
        );
        if (!savedFiles)
          throw new HttpException(
            'uploading files error',
            HttpStatus.NOT_IMPLEMENTED,
          );
      }

      if (project_tasks?.length) {
        const { message, error, status } =
          await this.projectTaskService.deleteAllProjectTasksByProjectId(id);
        if (error) throw new HttpException(message, status);

        const pr_tasks = await this.projectTaskService.createMany(
          project_tasks,
        );
        if (pr_tasks.error)
          throw new HttpException(pr_tasks.message, pr_tasks.status);
      }

      if (res?.categories?.length) {
        await prisma.categoriesOnProjects.deleteMany({
          where: {
            projectId: id,
          },
        });
      }

      if (res?.skills?.length) {
        await prisma.projectOnSkills.deleteMany({
          where: {
            projectId: id,
          },
        });
      }

      if (dimensions) {
        await prisma.projectDimension.deleteMany({
          where: {
            projectId: id,
          },
        });

        await prisma.projectDimension.create({
          data: {
            projectId: id,
            length: dimensions.length,
            width: dimensions.width,
            unit: dimensions.unit,
            result: dimensions.result,
          },
        });
      }

      const updatedProject = await prisma.project.update({
        where: {
          id,
        },
        data: {
          ...res,
          categories: res.categories && {
            create: res.categories.map((categoryId) => ({
              category: {
                connect: {
                  id: categoryId,
                },
              },
            })),
          },
          skills: res.skills && {
            create: res.skills.map((categoryId) => ({
              skill: {
                connect: {
                  id: categoryId,
                },
              },
            })),
          },
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'updated',
        details: updatedProject,
        error: null,
      };
    } catch (e) {
      return {
        status: HttpStatus.NOT_MODIFIED,
        message: 'error with updating project',
        details: null,
        error: e,
      };
    }
  }

  public async deleteProject(id: string): Promise<GeneralResponse> {
    try {
      const project = await prisma.project.findUnique({
        where: {
          id,
        },
      });
      if (!project) {
        throw new NotFoundException(`Project with id ${id} not found`);
      }
      //delete project files
      await this.fileService.deleteProjectFiles(id);

      //delete project
      const deletedProject = await prisma.project.delete({
        where: {
          id,
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'project deleted',
        details: deletedProject,
        error: null,
      };
    } catch (e) {
      return {
        status: HttpStatus.NOT_MODIFIED,
        message: 'error with deleting project',
        details: null,
        error: e,
      };
    }
  }

  public async setInviteDesigner(invite: InviteDTO): Promise<GeneralResponse> {
    try {
      const existData = await prisma.projectInvitation.findFirst({
        where: {
          authorId: invite.authorId,
          projectId: invite.projectId,
          providerId: invite.providerId,
        },
      });

      if (existData)
        throw new ConflictException(
          `Designer with id ${invite.providerId} exists already`,
        );

      const details = await prisma.projectInvitation.create({
        data: {
          project: {
            connect: {
              id: invite.projectId,
            },
          },
          provider: {
            connect: {
              id: invite.providerId,
            },
          },
          author: {
            connect: {
              id: invite.authorId,
            },
          },
        },
      });

      if (!details)
        throw new HttpException(
          'Something went wrong with action.',
          HttpStatus.BAD_REQUEST,
        );

      const notificationResponse =
        await this.notificationsService.createNotification({
          type: NotificationType.INVITATION,
          authorId: invite.authorId,
          receiverId: invite.providerId,
          message: 'Project invitation',
          projectInvitationId: details.id,
        });

      if (notificationResponse.error)
        throw new HttpException(
          'Something went wrong with creation invitation notification.',
          HttpStatus.BAD_REQUEST,
        );

      await this.gateway.sendNotification(
        invite.providerId,
        NotificationType.INVITATION,
        notificationResponse.details,
      );

      return {
        status: HttpStatus.OK,
        message: 'Successed',
        details,
      };
    } catch (error: any) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Something went wrong with creation invitation.',
        error,
      };
    }
  }

  public async setInviteWithdrawDesigner(
    invite: InviteDTO,
  ): Promise<GeneralResponse> {
    try {
      const data = await prisma.projectInvitation.deleteMany({
        where: {
          authorId: invite.authorId,
          projectId: invite.projectId,
          providerId: invite.providerId,
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'Successed',
        details: [],
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

  private async getProjectMatchedProviders(
    categories: string[],
    skills: string[],
    projectId: string,
  ): Promise<GeneralResponse> {
    try {
      const users = await prisma.user.findMany({
        where: {
          NOT: {
            projectInvitation: {
              some: {
                projectId: projectId,
              },
            },
          },
          Business: {
            some: {
              OR: [
                {
                  categories: {
                    some: {
                      category: {
                        name: {
                          in: categories,
                        },
                      },
                    },
                  },
                },
                {
                  services: {
                    some: {
                      service: {
                        name: {
                          in: skills,
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        include: {
          projectInvitation: true,
          Business: {
            include: {
              categories: {
                select: {
                  category: true,
                },
              },
              services: {
                select: {
                  service: true,
                },
              },
            },
          },
        },
      });

      const details = users
        .map((user) => ({
          ...user,
          Business: user.Business.map((business) => ({
            ...business,
            categories: business.categories.map(
              (category) => category.category,
            ),
            services: business.services.map((service) => service.service),
          })),
        }))
        .sort(
          (a, b) =>
            b.Business[0].categories.length - a.Business[0].categories.length,
        );

      return {
        status: HttpStatus.FOUND,
        message: 'found',
        details,
      };
    } catch (e) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'error with matched providers',
        error: e,
      };
    }
  }

  private async getProjectContactedProviders(
    projectId: string,
  ): Promise<GeneralResponse> {
    try {
      const users = await prisma.user.findMany({
        where: { projectInvitation: { some: { projectId } } },
        include: {
          Business: {
            include: {
              services: {
                select: {
                  service: true,
                },
              },
            },
          },
          projectInvitation: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      const details = users.sort(
        (a, b) =>
          b.projectInvitation
            .find((inv) => inv.projectId === projectId)
            .createdAt.getTime() -
          a.projectInvitation
            .find((inv) => inv.projectId === projectId)
            .createdAt.getTime(),
      );

      return {
        status: HttpStatus.FOUND,
        message: 'found',
        details,
      };
    } catch (e) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'error with matched providers',
        error: e,
      };
    }
  }
}
