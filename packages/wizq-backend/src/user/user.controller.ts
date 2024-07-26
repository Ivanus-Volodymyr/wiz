import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service';
import { GeneralResponse, GuardRequest } from '../types';
import { CreateUserAddressDto } from './dto/create-user-address-dto';
import { UserType } from '@prisma/client';
import { SentryInterceptor } from '../sentry/sentry.interceptor';
import { LoginDto } from './dto/login-dto';
import { CreateUserDto } from './dto/create-user-dto';

@UseInterceptors(SentryInterceptor)
@Controller('/users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/me')
  getCurrentUser(@Req() req: GuardRequest): GeneralResponse {
    return {
      status: HttpStatus.OK,
      message: 'user by id',
      details: req.currentUser,
      error: null,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/finish-signup')
  finishSignup(
    @Body() { userType }: { userType: UserType },
    @Req() req: GuardRequest,
  ): Promise<GeneralResponse> {
    return this.usersService.finishSignup(req.currentUser, { userType });
  }

  @Post('/form-login')
  userPasswordLogin(@Body() data: LoginDto): Promise<GeneralResponse> {
    return this.usersService.userPasswordLogin(data);
  }

  @Get('/')
  public async getUserData(
    @Query('type') type?: UserType,
  ): Promise<GeneralResponse> {
    if (type) {
      return await this.usersService.getUserByType(type);
    }

    return await this.usersService.getUserAll();
  }

  @Post('/create')
  createUser(@Body() data: CreateUserDto): Promise<GeneralResponse> {
    return this.usersService.createUserPassword(data);
  }

  @Get('/:id')
  getUserById(@Param('id') id: string): Promise<GeneralResponse> {
    return this.usersService.getUserById(id);
  }

  @Post('/address/create')
  createUserAddress(
    @Body() data: CreateUserAddressDto,
  ): Promise<GeneralResponse> {
    return this.usersService.createUserAddress(data);
  }
}
