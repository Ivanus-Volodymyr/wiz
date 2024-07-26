import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import prisma from '../prisma';
import { CurrentUser, GeneralResponse } from '../types';
import { AuthService } from '../auth/auth.service';
import { CreateUserAddressDto } from './dto/create-user-address-dto';
import { UserType } from '@prisma/client';
import { HttpService } from '@nestjs/axios';
import { LoginDto } from './dto/login-dto';
import { CreateUserDto } from './dto/create-user-dto';
import { Auth0RegisterResponse } from '../types/auth';

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    private readonly httpService: HttpService,
  ) {}

  public async finishSignup(
    user: CurrentUser,
    { userType }: { userType: UserType },
  ): Promise<GeneralResponse> {
    try {
      const userUpdate = await prisma.user.update({
        where: { id: user.id },
        data: { userType },
      });
      if (!userUpdate) {
        throw new Error('error updating user type');
      }
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'user type updated',
        details: userUpdate,
        error: null,
      };
    } catch (e) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'error updating user type',
        details: null,
        error: e,
      };
    }
  }

  /**
   * If user exists on DB but has no auth0UserId, update auth0 user with data from our DB, and borrow avatar from auth0 user
   * If user doesn't exist on DB, create new user with name
   * If user exists on DB and has auth0UserId, return user
   */
  public async createUserIfNotExists({
    email,
    auth0UserId,
    token,
    firstName,
    lastName,
    businessName,
    authType,
    userType,
  }: {
    email: string;
    auth0UserId: string;
    token: string;
    firstName: string;
    lastName: string;
    businessName: string;
    authType: string;
    userType: string;
  }): Promise<CurrentUser> {
    const [user] = await prisma.user.findMany({
      where: { email },
      take: 1,
      include: {
        addresses: true,
        Business: {
          include: {
            categories: true,
            services: true,
            location: true,
            businessProjects: true,
          },
        },
        projects: true,
        authorContracts: true,
      },
    });

    if (
      user?.auth0UserId === auth0UserId &&
      user?.email_verified &&
      authType !== 'signUp'
    ) {
      return user;
    }

    const {
      picture,
      email_verified,
      given_name,
      family_name,
      user_metadata: userMetadata,
    } = await this.authService.getAuth0UserByToken(token);

    if (user) {
      if (authType !== 'signUp') {
        if (user?.auth0UserId !== auth0UserId) {
          await this.authService.managementApiRequest(
            `api/v2/users/${auth0UserId}`,
            {
              method: 'PATCH',
              data: {
                given_name: user.firstName,
                family_name: user.lastName,
                name: `${user.firstName} ${user.lastName}`,
              },
            },
          );
        }

        return prisma.user.update({
          where: { id: user.id },
          data: { auth0UserId, email_verified },
          include: {
            addresses: true,
            Business: {
              include: {
                categories: true,
                services: true,
                location: true,
                businessProjects: true,
              },
            },
            projects: true,
            authorContracts: true,
          },
        });
      } else {
        return null;
      }
    }

    if (userType !== '') {
      return prisma.user.create({
        data: {
          userType: userMetadata?.userType
            ? (userMetadata?.userType as UserType)
            : userType !== ''
            ? (userType as UserType)
            : undefined,
          auth0UserId,
          email,
          firstName: firstName && firstName !== '' ? firstName : given_name,
          lastName: lastName && lastName !== '' ? lastName : family_name,
          picture,
          email_verified,
          businessName,
        },
      });
    }

    return {} as CurrentUser;
  }

  public async getUserAll(): Promise<GeneralResponse> {
    try {
      const details = await prisma.user.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          projects: true,
          addresses: true,
          Business: true,
          authorContracts: true,
          providerContracts: true,
          receivedNotifications: true,
          sentNotifications: true,
          projectProposals: true,
          authorProjectInvitation: true,
          projectInvitation: true,
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'Successed',
        details,
      };
    } catch (error: any) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: error
          ? error?.response
            ? error?.response
            : 'Something went wrong!'
          : 'Something went wrong!',
        error,
      };
    }
  }

  public async getUserByType(type: UserType): Promise<GeneralResponse> {
    try {
      const details = await prisma.user.findMany({
        where: { userType: type },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          projects: true,
          addresses: true,
          Business: {
            include: {
              location: true,
              services: {
                select: {
                  service: true,
                },
              },
            },
          },
          authorContracts: true,
          providerContracts: true,
          receivedNotifications: true,
          sentNotifications: true,
          projectProposals: true,
          authorProjectInvitation: true,
          projectInvitation: true,
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'Successed',
        details,
      };
    } catch (error: any) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: error
          ? error?.response
            ? error?.response
            : 'Something went wrong!'
          : 'Something went wrong!',
        error,
      };
    }
  }

  public async getUserById(id: string): Promise<GeneralResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          addresses: true,
        },
      });

      if (!user)
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      return {
        status: HttpStatus.OK,
        message: 'user by id',
        details: user,
        error: null,
      };
    } catch (e) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'error getting user by id',
        details: null,
        error: e,
      };
    }
  }

  public async createUserAddress(
    data: CreateUserAddressDto,
  ): Promise<GeneralResponse> {
    try {
      const { userId } = data;
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user)
        throw new HttpException('No such user in db', HttpStatus.NOT_FOUND);

      const existingAddress = await prisma.userAddress.findFirst({
        where: { name: data.name, userId: data.userId },
      });
      if (existingAddress)
        throw new HttpException(
          'Address already exists',
          HttpStatus.BAD_REQUEST,
        );
      const userAddress = await prisma.userAddress.create({ data });
      if (!userAddress)
        throw new HttpException(
          'error creating user address',
          HttpStatus.NOT_IMPLEMENTED,
        );

      return {
        status: HttpStatus.OK,
        message: 'user addresses',
        details: userAddress,
        error: null,
      };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'error create user address',
        details: null,
        error: e,
      };
    }
  }

  public async userPasswordLogin({
    email,
    password,
  }: LoginDto): Promise<GeneralResponse> {
    try {
      const url = `${process.env.AUTH0_ISSUER_URL}oauth/token`;
      const { data } = await this.httpService.axiosRef.post(url, {
        username: email,
        password: password,
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUTH0_AUDIENCE,
        grant_type: 'password',
        scope: 'openid profile email',
      });
      return {
        status: HttpStatus.OK,
        message: 'user login',
        details: data,
        error: null,
      };
    } catch (e) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'error user login',
        details: null,
        error: e,
      };
    }
  }

  public async createUserPassword(
    userData: CreateUserDto,
  ): Promise<GeneralResponse> {
    try {
      const { details } = await this.getAccessToken();
      const accessToken = details.accessToken;
      if (!accessToken)
        throw new HttpException(
          "Can't get access token",
          HttpStatus.UNAUTHORIZED,
        );

      const reqData = {
        email: userData.email,
        user_metadata: {
          userType: userData.user_type,
        },
        given_name: userData.first_name,
        family_name: userData.last_name,
        name: `${userData.first_name} ${userData.last_name}`,
        nickname: userData.email.split('@')[0],
        connection: 'Username-Password-Authentication',
        password: userData.password,
        verify_email: true,
      };

      const url = `${process.env.AUTH0_AUDIENCE}users`;
      const { data } =
        await this.httpService.axiosRef.post<Auth0RegisterResponse>(
          url,
          reqData,
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          },
        );

      const newUserData = await prisma.user.create({
        data: {
          userType: (data.user_metadata.userType as UserType) ?? undefined,
          auth0UserId: data.user_id,
          email: data.email,
          firstName: data.given_name,
          lastName: data.family_name,
          picture: data.picture,
          email_verified: data.email_verified,
          businessName: userData.business_name,
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'user successfully registered',
        details: newUserData,
        error: null,
      };
    } catch (e) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'user registration error',
        details: null,
        error: e,
      };
    }
  }

  private async getAccessToken(): Promise<GeneralResponse> {
    try {
      const url = `${process.env.AUTH0_ISSUER_URL}oauth/token`;
      const { data } = await this.httpService.axiosRef.post(url, {
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUTH0_AUDIENCE,
        grant_type: 'client_credentials',
      });
      return {
        status: HttpStatus.OK,
        message: 'success',
        details: {
          accessToken: data.access_token as string,
        },
      };
    } catch (e) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'error user login',
        details: null,
        error: e,
      };
    }
  }
}
