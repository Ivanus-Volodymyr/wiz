import { Injectable, UploadedFile } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.REGION,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_BUCKET,
        secretAccessKey: process.env.SECRET_ACCESS_KEY_BUCKET,
      },
    });
  }

  async uploadProjectFile(
    @UploadedFile() file,
    folder: string,
    buffer?: Buffer,
  ): Promise<string> {
    try {
      const filePath = buffer
        ? this.filePath(`thumbnail_${file.originalname}`, folder)
        : this.filePath(file.originalname, folder);
      const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Body: buffer ? buffer : file.buffer,
        Key: filePath,
        ContentType: file.mimetype,
        ACL: 'public-read',
      });

      await this.s3Client.send(command);
      const fileUrl = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${filePath}`;

      return fileUrl;
    } catch (e) {
      throw new Error('Upload file to AWS S3 bucket failed', { cause: e });
    }
  }

  async deleteProjectFileFromAws(
    fileKey: string,
  ): Promise<DeleteObjectCommandOutput> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: fileKey,
      });

      return this.s3Client.send(command);
    } catch (e) {
      throw new Error('Delete file from AWS S3 bucket failed');
    }
  }

  private filePath(fileName: string, folder): string {
    try {
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      return `wizquotes/${folder}/images/${fileName}/${randomName}${fileName}`;
    } catch (e) {
      throw new Error('Image path not provided');
    }
  }
}
