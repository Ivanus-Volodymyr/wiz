import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateProjectDimensionDto } from './create-project-dimension-dto';
import { CreateProjectTaskDto } from '../project_task/dto/create-project-task-dto';

export class CreateProjectDto {
  @IsString()
  public name = '';

  @IsOptional()
  public description = '';

  @IsString()
  public address = '';

  @IsArray()
  public categories?: string[];

  @IsObject()
  public dimensions?: CreateProjectDimensionDto;

  @IsString()
  public start_date = '';

  @IsString()
  floor_plan = '';

  @IsString()
  skill_level = '';

  @IsString()
  min_budget = '';

  @IsString()
  max_budget = '';

  @IsString()
  public status?: string;

  @IsNumber()
  public stage?: number;

  @IsArray()
  public skills?: string[];

  @IsArray()
  public project_tasks?: CreateProjectTaskDto[];

  @IsBoolean()
  public is_private?: boolean;

  @IsString()
  public authorId!: string;
}
