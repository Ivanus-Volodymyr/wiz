import { IsString } from 'class-validator';

export class SuggestSkillDto {
  @IsString()
  description = '';
}
