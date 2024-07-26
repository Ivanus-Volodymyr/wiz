import { IsNumber } from 'class-validator';

export class CreateProjectDimensionDto {
  @IsNumber()
  length: number;

  @IsNumber()
  width: number;

  @IsNumber()
  unit: number;

  @IsNumber()
  result: number;
}
