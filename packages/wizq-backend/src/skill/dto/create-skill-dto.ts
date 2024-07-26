import { IsString } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  public name!: string;
}
