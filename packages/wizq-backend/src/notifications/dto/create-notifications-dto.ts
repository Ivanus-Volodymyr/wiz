import { IsString } from 'class-validator';

export class CreateNotificationsDto {
  @IsString()
  public receiverId!: string;

  @IsString()
  public authorId = '';

  @IsString()
  public projectProposalId?: string;

  @IsString()
  public projectInvitationId?: string;

  public type = '';

  @IsString()
  public message = '';
}
