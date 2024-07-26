import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { expressJwtSecret } from 'jwks-rsa';
import { expressjwt as jwt } from 'express-jwt';
import jwtDecode from 'jwt-decode';
import type { Response } from 'express';
import { UserService } from '../user/user.service';
import { GuardRequest, JWTDecoded } from '../types';

/**
 * The guard that checks if the user is authenticated and creates a user if it doesn't exist.
 * The login flow:
 * 1. User logs in with Auth0 on their domain
 * 2. Auth0 redirects user back to the frontend with a token
 * 3. Frontend makes a request with the token to a random endpoint that uses AuthGuard
 * 4. Backend checks if the token is valid and creates a user on our DB if it doesn't exist based on data extracted from the token
 */

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: GuardRequest = context.getArgByIndex(0);
    const res: Response = context.getArgByIndex(1);

    const checkJwt = jwt({
      // @ts-expect-error Not important
      secret: expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH0_ISSUER_URL}.well-known/jwks.json`,
      }),
      audience: process.env.AUTH0_AUDIENCE,
      issuer: process.env.AUTH0_ISSUER_URL,
      algorithms: ['RS256'],
    });

    if (!req.headers.authorization) {
      throw new UnauthorizedException();
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      await checkJwt(req, res, () => {
        /** */
      });
    } catch (e) {
      throw new UnauthorizedException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const decodedToken = jwtDecode(token) as JWTDecoded;
    const userEmail = decodedToken?.['https://wizquotes'];
    const { sub } = decodedToken;

    if (!userEmail) {
      throw new InternalServerErrorException("Auth0 rule didn't send email");
    }

    const user = await this.userService.createUserIfNotExists({
      auth0UserId: sub,
      token,
      email: userEmail,
      firstName: req?.query?.firstName as string,
      lastName: req?.query?.lastName as string,
      businessName: req?.query?.businessName as string,
      authType: req?.query?.authType as string,
      userType: req?.query?.userType as string,
    });

    // make this data avaliable to controllers as @Req() req: GuardRequest
    req.token = token;
    req.decodedToken = decodedToken;
    req.currentUser = user;

    return true;
  }
}
