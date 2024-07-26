import { Category } from '@prisma/client';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class BusinessProjectDTO {
  constructor(args: BusinessProjectDTO) {
    this.name = args.name;
    this.location = args.location;
    this.categories = args.categories;
  }

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsArray()
  @IsOptional()
  categories?: string[];
}
