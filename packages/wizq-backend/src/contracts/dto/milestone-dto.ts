import { IsString } from 'class-validator';

export class MilestoneDTO {
  constructor(args: MilestoneDTO) {
    this.name = args.name;
    this.amount = args.amount;
  }

  @IsString()
  name: string;

  @IsString()
  amount: string;
}
