import {
  ContractsType,
  InvoiceCycleEnds,
  NoticePeriodUnit,
  PaymentFrequency,
} from '@prisma/client';
import { IsOptional, IsString, IsEnum, IsArray } from 'class-validator';

export class ContractsDTO {
  constructor(args: ContractsDTO) {
    this.projectId = args.projectId;
    this.name = args.name;
    this.description = args.description;
    this.providerId = args.providerId;
    this.start_date = args.start_date;
    this.end_date = args.end_date;
    this.contract_amount = args.contract_amount;
    this.hourly_rate = args.hourly_rate;
    this.weekly_limit = args.weekly_limit;
    this.payment_rate = args.payment_rate;
    this.payment_frequency = args.payment_frequency;
    this.invoice_cycle_ends = args.invoice_cycle_ends;
    this.payment_due_date = args.payment_due_date;
    this.payment_first_day = args.payment_first_day;
    this.payment_amount = args.payment_amount;
    this.authorId = args.authorId;
    this.id = args.id;
    this.contract_type = args.contract_type;
  }

  @IsString()
  id!: string;

  @IsString()
  authorId!: string;

  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  providerId?: string;

  @IsString()
  @IsOptional()
  start_date?: string;

  @IsString()
  @IsOptional()
  end_date?: string;

  @IsString()
  @IsOptional()
  contract_amount?: string;

  @IsArray()
  @IsOptional()
  milestones?: string[];

  @IsString()
  @IsOptional()
  hourly_rate?: string;

  @IsString()
  @IsOptional()
  weekly_limit?: string;

  @IsString()
  @IsOptional()
  payment_rate?: string;

  @IsEnum(PaymentFrequency)
  @IsOptional()
  payment_frequency?: PaymentFrequency;

  @IsEnum(InvoiceCycleEnds)
  @IsOptional()
  invoice_cycle_ends?: InvoiceCycleEnds;

  @IsString()
  @IsOptional()
  payment_due_date?: string;

  @IsString()
  @IsOptional()
  payment_first_day?: string;

  @IsString()
  @IsOptional()
  payment_amount?: string;

  @IsString()
  @IsOptional()
  termination_date?: string;

  @IsString()
  @IsOptional()
  notice_period?: string;

  @IsEnum(NoticePeriodUnit)
  @IsOptional()
  period_unit?: NoticePeriodUnit;

  @IsEnum(ContractsType)
  @IsOptional()
  contract_type?: ContractsType;
}
