import { UserData } from './user';

export interface AuthInitialState {
  isUserTypeModalOpen: boolean;
  accessToken: string | null;
  user: UserData | null;
  signupErrorPolicy: string;
  authToken: string | null;
  auth0userId: string;
}

export interface AuthCheckSessionProps {
  accessToken: string;
  idTokenPayload: {
    email_verified: string;
  };
}

export interface Auth0TokenProps {
  status: number;
  data: {
    access_token: string;
  };
}

export interface AuthLoginData {
  access_token: string;
  scope: string;
  expires_in: number;
  token_type: string;
}

export interface PasswordRegisterData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  user_type: 'HOME_OWNER' | 'SERVICE_PROVIDER';
  business_name: string;
}

export interface Auth0RegisterResponse {
  created_at: string;
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  name: string;
  nickname: string;
  picture: string;
  updated_at: string;
  user_id: string;
  user_metadata: {
    userType: 'HOME_OWNER' | 'SERVICE_PROVIDER';
    name: string;
  };
}
