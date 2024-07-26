import { IsArray } from 'class-validator';

export class SuggestServicesDto {
  @IsArray()
  services = [];
}
