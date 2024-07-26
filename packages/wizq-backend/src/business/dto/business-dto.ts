import { Category, Services } from '@prisma/client';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class BusinessDTO {
  constructor(args: BusinessDTO) {
    this.authorId = args.authorId;
    this.name = args.name;
    this.description = args.description;
    this.license = args.license;
    this.employee_cnt = args.employee_cnt;
    this.categories = args.categories;
    this.services = args.services;
    this.country = args.country;
    this.state = args.state;
    this.address = args.address;
    this.city = args.city;
    this.zipcode = args.zipcode;
    this.like_location = args.like_location;
    this.hourly_rate = args.hourly_rate;
  }

  @IsString()
  authorId!: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  license?: string;

  @IsString()
  @IsOptional()
  employee_cnt?: string;

  @IsArray()
  @IsOptional()
  categories?: Category[];

  @IsArray()
  @IsOptional()
  services?: Services[];

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  zipcode?: string;

  @IsArray()
  @IsOptional()
  like_location?: string[];

  @IsString()
  @IsOptional()
  hourly_rate?: string;
}
