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
