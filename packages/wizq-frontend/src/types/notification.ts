import { ProjectProposal } from './proposal';
import { User } from './index';
import { ProjectInvitationType } from './project';

export interface Notification {
  type: 'PROPOSALS' | 'MESSAGES' | 'INVITATION';
  id: string;
  details: {
    message: string;
    is_read: boolean;
    createdAt: string | Date;
    authorId: User['id'];
    receiverId: User['id'];
    projectProposalId: ProjectProposal['id'] | null;
    author: User;
    projectProposal: ProjectProposal | null;
    projectInvitation: ProjectInvitationType | null;
  };
}
