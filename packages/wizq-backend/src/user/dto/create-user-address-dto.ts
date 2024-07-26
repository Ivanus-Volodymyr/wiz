import { IsString } from 'class-validator';

export class CreateUserAddressDto {
  @IsString()
  userId = '';

  @IsString()
  name = '';
}
