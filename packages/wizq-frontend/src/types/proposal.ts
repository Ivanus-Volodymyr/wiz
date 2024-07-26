import { FileType } from './index';
import { LoadProjectResponse } from './project';
import { UserData } from './user';

export interface ProjectProposalsFile extends FileType {
  projectProposalId: ProjectProposal['id'];
  projectProposal: ProjectProposal;
}
export interface ProjectProposalTask {
  id: string;
  task_item: string;
  task_description: string | null;
  estimated_price: number;
  projectProposalId: ProjectProposal['id'];
  projectProposal: ProjectProposal;
}

export interface ProjectProposal {
  id: string;
  proposed_bid: string;
  comment: string;
  createdAt: string | Date;
  project_owner_id: UserData['id'];
  project: LoadProjectResponse;
  authorId: UserData['id'];
  author: UserData;
  projectId: LoadProjectResponse['id'];
  tasks: ProjectProposalTask[];
  files: ProjectProposalsFile[];
}
