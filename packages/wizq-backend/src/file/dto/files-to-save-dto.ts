import { UploadedFileDto } from './uploaded-file-dto';
import { IsString } from 'class-validator';

export class FilesToSaveDto extends UploadedFileDto {
  @IsString()
  public projectId!: string;
}
