import { BusinessResponse } from './business';
import { ContractsResponse } from './contracts';
import { LoadProjectResponse, ProjectInvitationType } from './project';
import { Payments } from './payment';

export interface UserData {
  id: string;
  entityType: string;
  firstName: string;
  lastName: string;
  businessName: string;
  auth0UserId: string;
  email: string;
  picture: string;
  addresses: UserAddress[];
  userType: string;
  subType: string;
  earned: string;
  email_verified: boolean;
  Business?: BusinessResponse[];
  projects?: LoadProjectResponse[];
  projectInvitation?: ProjectInvitationType[];
  payments: Payments;
}

export interface UsersInitialState {
  me: UserData | null;
}

export interface UserAddress {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoogleAddressValidation {
  predictions: { description: string }[];
}
