import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';
import { KnownAny } from '../types';

interface Auth0User {
  user_id: string;
  nickname: string;
  name: string;
  picture: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
  given_name: string;
  family_name: string;
  user_metadata: {
    userType: string;
  };
}

@Injectable()
export class AuthService {
  // makes a custom request to Auth0 Management API
  async managementApiRequest<TRespData>(
    path: string,
    {
      method = 'GET',
      data,
    }: {
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      data?: Record<string, KnownAny>;
    },
  ) {
    const managementToken = await this.#getAuth0ManagementToken();

    const options = {
      method,
      url: `${process.env.AUTH0_ISSUER_URL}${path}`,
      headers: {
        'content-type': 'application/json',
        'Accept-Encoding': 'gzip,deflate,compress',
        Authorization: `Bearer ${managementToken}`,
      },
      data: data ? JSON.stringify(data) : undefined,
    };

    let resp: { data: TRespData };

    try {
      resp = await axios.request<TRespData>(options);
      return resp.data;
    } catch (e) {
      const err = e as { response?: { data?: { message: string } } };
      console.error(err.response.data);
      throw new BadRequestException(
        `Management API Error: ${
          err.response?.data?.message ?? 'Unknown error'
        }`,
      );
    }
  }

  /**
   * Returns user from Auth0 by token
   */
  async getAuth0UserByToken(token: string): Promise<Auth0User> {
    const resp = await axios.request<Auth0User>({
      method: 'GET',
      url: `${process.env.AUTH0_ISSUER_URL}userinfo`,
      headers: {
        'content-type': 'application/json',
        'Accept-Encoding': 'gzip,deflate,compress',
        Authorization: `Bearer ${token}`,
      },
    });

    return resp.data;
  }

  // returns Auth0 Management API token
  async #getAuth0ManagementToken() {
    const options = {
      method: 'POST',
      url: `${process.env.AUTH0_ISSUER_URL}oauth/token`,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': 'gzip,deflate,compress',
      },
      data: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: `${process.env.AUTH0_ISSUER_URL}api/v2/`,
      }),
    };

    try {
      const resp = await axios.request<{ access_token: string }>(options);

      return resp.data.access_token;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(
        'Unable to obtain Auth0 Management API key',
      );
    }
  }
}
