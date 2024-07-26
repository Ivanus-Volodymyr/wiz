import { IsNumber, IsString } from 'class-validator';

export class ProjectProposalTaskDto {
  constructor(arg: ProjectProposalTaskDto) {
    this.task_item = arg.task_item;
    this.task_description = arg.task_description;
    this.estimated_price = arg.estimated_price;
  }
  @IsString()
  public task_item!: string;
  @IsString()
  public task_description?: string;
  @IsNumber()
  public estimated_price!: number;
}
