import { IsString } from 'class-validator';

export class InviteDTO {
  constructor(args: InviteDTO) {
    this.authorId = args.authorId;
    this.projectId = args.projectId;
    this.providerId = args.providerId;
  }

  @IsString()
  authorId: string;

  @IsString()
  projectId: string;

  @IsString()
  providerId: string;
}
