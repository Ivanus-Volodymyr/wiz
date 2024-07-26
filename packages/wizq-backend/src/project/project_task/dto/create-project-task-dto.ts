import { IsString } from 'class-validator';

export class CreateProjectTaskDto {
  @IsString()
  public name = '';

  @IsString()
  public projectId = '';
}
