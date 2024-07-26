import { IsString } from 'class-validator';

import { UploadedFileDto } from '../../../../file/dto/uploaded-file-dto';

export class ProjectProposalsFileDto extends UploadedFileDto {
  @IsString()
  public projectProposalId!: string;
}
