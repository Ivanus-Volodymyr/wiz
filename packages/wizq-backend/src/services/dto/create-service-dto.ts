import { IsString } from 'class-validator';

export class CreateServiceDTO {
  @IsString()
  public name!: string;
}
