import { IsString } from 'class-validator';

export class UploadedFileDto {
  @IsString()
  public originalName!: string;
  @IsString()
  public fileUrl!: string;
  @IsString()
  public thumbUrl!: string;
  @IsString()
  public size!: number;
}
