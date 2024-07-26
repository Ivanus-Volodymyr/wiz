import { FileType, Option } from './';
import { UserData } from './user';

export interface SuggestedServicesResponse {
  suggestedServices: Option[];
}

export type BusinessParamType = {
  id?: string;
  authId?: string;
};

export type CountryType = {
  name: string;
  code: string;
};
export interface BusinessInitialState {
  suggestedServices: Option[];
  business: BusinessInitialType;
  businesses: BusinessInitialType[];
}

export type BusinessInitialType = {
  id?: string;
  name?: string;
  authorId?: string;
  description?: string;
  categories?: Option[];
  license?: string;
  employee_cnt?: string;
  services?: Option[];
  location?: BusinessLocationType[];
  businessProjects: BusinessProjectType[];
  like_location?: string;
  hourly_rate?: string;
};

export interface BusinessProjectInitialState {
  projects: {
    id?: string;
    businessId?: string;
    name?: string;
    location?: string;
    categories?: Option[];
    files?: File[] | FileType[];
  };
}

export type BusinessOverviewType = {
  name?: string;
  description?: string;
  categories?: Option[];
  license?: string;
  employee_cnt?: string;
};

export type BusinessServicesType = {
  services?: Option[];
};

export type BusinessLocationType = {
  country?: string;
  state?: string;
  address?: string;
  city?: string;
  zipcode?: string;
};

export type BusinessProjectType = {
  id?: string;
  businessId?: string;
  name?: string;
  location?: string;
  businessCategories?: Option[];
  files?: File[] | FileType[];
};

export interface Business
  extends BusinessOverviewType,
    BusinessServicesType,
    BusinessLocationType,
    BusinessProjectType {
  id?: string | null;
  authorId?: string;
  like_location?: Option[];
  hourly_rate?: string;
}

export interface BusinessResponse {
  id: string;
  authorId: string;
  name: string;
  description: string;
  license: string;
  employee_cnt: string;
  like_location: string;
  hourly_rate?: string;
  author: Partial<UserData>;
  categories: Option[];
  services: Option[];
  location: BusinessLocationType[];
  businessProjects: BusinessProjectType[];
  createdAt: string;
  updatedAt: string;
}

export interface BusinessProjectResponse {
  id: string;
  businessId: string;
  name: string;
  location: string;
  categories: Option[];
  files: FileType[];
}
