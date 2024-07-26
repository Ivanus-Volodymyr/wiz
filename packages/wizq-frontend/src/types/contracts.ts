import { FileType } from './';
import { CreateProject } from './project';
import { UserData } from './user';

export enum ContractsType {
  empty = '',
  milestone = 'MILESTONE',
  fixed_rate = 'FIXED_RATE',
  hourly = 'HOURLY',
}

export const PaymentFrequency: string[] = ['WEEKLY', 'BI_WEEKLY', 'MONTHLY'];

export const InvoiceCycleEnds: string[] = [
  '26th day of the month',
  '27th day of the month',
  '28th day of the month',
  '29th day of the month',
  '30th day of the month',
  'Last day of the month',
];

export enum NoticePeriodUnit {
  days = 'DAYS',
  month = 'MONTH',
}

export type MilestoneAmountType = {
  id?: string;
  contractId?: string;
  name: string;
  amount: string;
};

export type ContractsParamType = {
  id?: string;
  authId?: string;
  contractType?: string;
};

export interface ContractsInitialState {
  contract: {
    id?: string;
    contractId?: string;
    projectId?: string;
    name?: string;
    description?: string;
    providerId?: string;
    start_date?: string;
    end_date?: string;
    contract_type?: ContractsType;
    project?: CreateProject;
    provider?: Partial<UserData>;
    contract_amount?: string;
    hourly_rate?: string;
    weekly_limit?: string;
    payment_rate?: string;
    payment_frequency?: string;
    invoice_cycle_ends?: string;
    payment_due_date?: string;
    payment_first_day?: string;
    payment_amount?: string;
    milestones?: MilestoneAmountType[];
    termination_date?: string;
    notice_period?: string;
    period_unit?: NoticePeriodUnit;
    files?: File[] | FileType[];
  };
  contracts: {
    id?: string;
    contractId?: string;
    projectId?: string;
    name?: string;
    description?: string;
    providerId?: string;
    start_date?: string;
    end_date?: string;
    contract_type?: ContractsType;
    project?: CreateProject;
    provider?: Partial<UserData>;
    contract_amount?: string;
    hourly_rate?: string;
    weekly_limit?: string;
    payment_rate?: string;
    payment_frequency?: string;
    invoice_cycle_ends?: string;
    payment_due_date?: string;
    payment_first_day?: string;
    payment_amount?: string;
    milestones?: MilestoneAmountType[];
    termination_date?: string;
    notice_period?: string;
    period_unit?: NoticePeriodUnit;
    files?: File[] | FileType[];
  }[];
}

export type ContractsGeneralType = {
  name?: string;
  description?: string;
  projectId?: string;
  providerId?: string;
  start_date?: string;
  end_date?: string;
};

export type ContractsPaymentType = {
  contract_amount?: string;
  hourly_rate?: string;
  weekly_limit?: string;
  payment_rate?: string;
  payment_frequency?: string;
  invoice_cycle_ends?: string;
  payment_due_date?: string;
  payment_first_day?: string;
  payment_amount?: string;
  milestones?: MilestoneAmountType[];
};

export type ContractsComplianceType = {
  termination_date?: string;
  notice_period?: string;
  period_unit?: NoticePeriodUnit;
  files?: File[] | FileType[];
};

export interface Contracts extends ContractsGeneralType, ContractsPaymentType, ContractsComplianceType {
  id?: string | null;
  authorId?: string;
  contractId?: string;
  contract_type?: ContractsType;
}

export interface ContractsResponse {
  id: string;
  contractId: string;
  authorId: string;
  projectId: string;
  name: string;
  description: string;
  providerId: string;
  start_date: string;
  end_date: string;
  contract_amount: string;
  hourly_rate: string;
  weekly_limit: string;
  payment_rate: string;
  payment_frequency: string;
  invoice_cycle_ends: string;
  payment_due_date: string;
  payment_first_day: string;
  payment_amount: string;
  milestones: MilestoneAmountType[];
  termination_date: string;
  notice_period: string;
  period_unit: NoticePeriodUnit;
  files: FileType[];
  project: CreateProject;
  provider: Partial<UserData>;
  author: Partial<UserData>;
  contract_type: ContractsType;
  createdAt: string;
  updatedAt: string;
}
