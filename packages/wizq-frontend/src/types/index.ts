// eslint-disable-next-line import/no-extraneous-dependencies
// import { UserType } from '@prisma/client';

export const UserType1 = {
  HOME_OWNER: 'HOME_OWNER',
  SERVICE_PROVIDER: 'SERVICE_PROVIDER',
};
export type UserType = (typeof UserType1)[keyof typeof UserType1];

export type User = {
  id: string;
  entityType: EntityType;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
  businessName: string;
  auth0UserId: string | null;
  email: string;
  picture: string | null;
  userType: UserType | null;
};

export const EntityType1 = {
  USER: 'USER',
  TEST_ENTITY: 'TEST_ENTITY',
};
export type EntityType = (typeof EntityType1)[keyof typeof EntityType1];

/**
 * Model UserAddress
 *
 */
export type UserAddress = {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Model TestEntity
 *
 */
export type TestEntity = {
  id: string;
  entityType: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  phone: string;
};

export type KnownAny = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never;

export type EntityData<T> = Record<string, T> & {
  __updatedTimes?: number;
};

// common entity shape
export interface Entity {
  id: string;
  // from server-side dates comes as strings, but Prisma defines dates as Date instance
  createdAt: Date;
  updatedAt: Date;
  entityType: EntityType;
  [key: string]: unknown;
}

export type Option = {
  id: string;
  name: string;
  categoryId?: string;
  serviceId?: string;
  service?: {
    id: string;
    name: string;
  };
};

export type FileType = {
  id: string;
  fileUrl: string;
  originalName: string;
  size: number;
};
