import { HttpStatus, Injectable } from '@nestjs/common';

import prisma from '../prisma';

import { S3Service } from '../s3/s3.service';
import { UploadedFileDto } from './dto/uploaded-file-dto';
import { FileDto } from './dto/file-dto';
import { FilesToSaveDto } from './dto/files-to-save-dto';
import { AwsStorageFolder, GeneralResponse } from '../types';
import * as imageThumbnail from 'image-thumbnail';

@Injectable()
export class FileService {
  constructor(private readonly s3Service: S3Service) {}

  public async uploadFiles(files: FileDto[]): Promise<UploadedFileDto[]> {
    try {
      const uploadedFiles: UploadedFileDto[] = [];

      for (const file of files) {
        const isImage = file.mimetype.includes('image');
        const buffer = isImage
          ? await imageThumbnail(file.buffer, {
              width: 180,
              height: 180,
              responseType: 'buffer',
            })
          : undefined;

        const fileUrl = await this.s3Service.uploadProjectFile(
          file,
          AwsStorageFolder.PROJECT,
        );

        const thumbUrl = await this.s3Service.uploadProjectFile(
          file,
          AwsStorageFolder.PROJECT,
          buffer,
        );

        const newFile = {
          originalName: file.originalname,
          fileUrl,
          thumbUrl,
          size: file.size,
        };
        if (!isImage) delete newFile.thumbUrl;

        uploadedFiles.push(newFile);
      }

      return uploadedFiles;
    } catch (e) {
      console.log(e);

      throw new Error('There is an error uploading files', { cause: e });
    }
  }

  public async deleteProjectFiles(id: string): Promise<string> {
    try {
      const files = await prisma.projectFile.findMany({
        where: {
          projectId: id,
        },
      });

      const strings = files.map((file) => {
        const parts = file.fileUrl.split('/');
        return parts.slice(3).join('/');
      });

      for (const string of strings) {
        await this.s3Service.deleteProjectFileFromAws(string);
      }

      await prisma.projectFile.deleteMany({
        where: {
          projectId: id,
        },
      });

      return 'Files deleted successfully';
    } catch (e) {
      throw new Error('There is an error deleting files', e as Error);
    }
  }

  public async saveProjectFilesInDb(files: FilesToSaveDto[]) {
    try {
      return prisma.projectFile.createMany({ data: files });
    } catch (e) {
      throw new Error('There is an error saving files in db', { cause: e });
    }
  }

  public async deleteOneProjectFile(fileId: string): Promise<GeneralResponse> {
    try {
      const file = await prisma.projectFile.findUnique({
        where: { id: fileId },
      });
      if (!file) throw new Error('No such file in db');
      const fileKeyInAws = file.fileUrl.split('/').slice(3).join('/');
      await this.s3Service.deleteProjectFileFromAws(fileKeyInAws);
      const deletedFile = await prisma.projectFile.delete({
        where: { id: fileId },
      });
      return {
        status: HttpStatus.OK,
        message: `project file with id ${fileId} deleted successfully`,
        details: deletedFile,
        error: null,
      };
    } catch (e) {
      return {
        status: HttpStatus.NOT_MODIFIED,
        message: 'error with deleting file',
        details: null,
        error: e,
      };
    }
  }

  public async deleteManyProjectFilesByIds(
    ids: string[],
  ): Promise<GeneralResponse> {
    try {
      const files = await prisma.projectFile.findMany({
        where: { id: { in: ids } },
      });
      const strings = files.map((file) => {
        const parts = file.fileUrl.split('/');
        return parts.slice(3).join('/');
      });

      for (const string of strings) {
        await this.s3Service.deleteProjectFileFromAws(string);
      }

      const deletedFiles = await prisma.projectFile.deleteMany({
        where: { id: { in: ids } },
      });
      return {
        status: HttpStatus.OK,
        message: 'Project files deleted successfully',
        details: deletedFiles,
        error: null,
      };
    } catch (e) {
      return {
        status: HttpStatus.NOT_MODIFIED,
        message: 'error with deleting project files',
        details: null,
        error: e,
      };
    }
  }
}
