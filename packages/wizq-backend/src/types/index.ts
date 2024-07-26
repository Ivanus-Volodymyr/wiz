import type { User } from '@prisma/client';
import type { Request } from 'express';

export type KnownAny = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export type CurrentUser = User; // we can extend it later with more fields

export interface GuardRequest extends Request {
  token: string;
  decodedToken: JWTDecoded;
  currentUser: CurrentUser;
}

export interface JWTDecoded {
  iss: string;
  sub: string;
  aud: string[];
  iat: number;
  exp: number;
  azp: string;
  scope: string;
  userEmail: string; // custom field defined by a Auth0 rule
}

export interface GeneralResponse {
  status: number;
  message: string;
  details?: any | null;
  error?: any | null;
}

export enum AwsStorageFolder {
  PROJECT = 'project',
}

export enum NotificationType {
  MASSAGES = 'MASSAGES',
  PROPOSALS = 'PROPOSALS',
  INVITATION = 'INVITATION',
}
