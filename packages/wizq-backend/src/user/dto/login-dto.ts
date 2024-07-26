import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  email = '';

  @IsString()
  password = '';
}
