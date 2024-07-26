import { FileType, Option } from './';
import { Contracts } from './contracts';
import { UserData } from './user';
import { ProjectProposal } from './proposal';
import { MANAGE_SP_TABS } from '../utils/projectInformation';

export interface ProjectInitialState {
  selectedProject: CreateProject;
  selectedProjectId: CreateProject['id'];
  suggestedSkills: Option[];
  selectedProposal: ProjectProposal['id'] | null;
  manageSPTab: (typeof MANAGE_SP_TABS)[number];
  createProjectStep: number;
  isReviewing: boolean;
}

export type Step = {
  id: number;
  name: string;
};

export type LengthUnit = {
  name: string;
  value: number;
};

export type UpdateProjectRequestData = {
  name: string;
  description?: string;
  address: string;
  categories: string[];
  dimensions: Dimensions;
  start_date: string;
  is_private: boolean;
  authorId: string;
  floor_plan?: string;
  skill_level: string;
  skills: string[];
  project_tasks: {
    projectId: string;
    name: string;
  }[];
  min_budget: string;
  max_budget: string;
};

export type FloorPlanData = {
  floor_plan?: string;
};

export type ServiceProviderData = {
  skill_level: string;
  skills: Option[];
  project_tasks: Option[];
};

export interface CreateProject extends ProjectInformationData, FloorPlanData, ServiceProviderData, BudgetData {
  id: string | null;
  proposals: ProjectProposal[];
  matched: UserData[];
  contacted: UserData[];
}

export interface LoadProjectResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  address: string;
  dimensions: Dimensions;
  start_date: string;
  is_private: boolean;
  floor_plan: string;
  skill_level: string;
  min_budget: string;
  max_budget: string;
  authorId: string;
  files: FileType[];
  author: Partial<UserData>;
  tasks: Option[];
  categories: Option[];
  skills: Option[];
  contracts: Contracts[];
  projectInvitation: {
    id: string;
    authorId: string;
    projectId: string;
    providerId: string;
    provider: Partial<UserData>;
  }[];
  proposals: ProjectProposal[];
  matched: UserData[];
  contacted: UserData[];
}

export type ProjectInformationData = {
  name: string;
  description?: string;
  address: string;
  files?: File[] | FileType[];
  categories: Option[];
  dimensions: Dimensions;
  start_date: string;
  is_private: boolean;
  authorId?: string;
};

export interface CreateProjectResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: null | string;
  description: null | string;
  address: null | string;
  dimensions: null | Dimensions;
  start_date: null | string;
  is_private: boolean;
  authorId: string;
  floor_plan: string;
  min_budget: string;
  max_budget: string;
}

export interface BudgetData {
  min_budget: string;
  max_budget: string;
}

export interface DesignerInfo {
  id: string;
  name: string;
  role: string;
  avatar: string;
  currency: string;
  cost: string;
  location: string;
  earned: string;
  online: boolean;
}

export interface SuggestedSkillsResponse {
  suggestedSkills: Option[];
  preselectedSkills: Option[];
}

export interface Dimensions {
  length: number;
  width: number;
  unit: number;
  result: number;
}

export type ProjectInvitationType = {
  id?: string;
  createdAt?: string;
  authorId?: string;
  projectId?: string;
  providerId?: string;
  project: Omit<LoadProjectResponse, 'projectInvitation'>;
};
