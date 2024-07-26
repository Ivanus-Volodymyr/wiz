import React from 'react';
import HeartIcon from '../../assets/icons/Icons=Heart.svg';
import Button from '../common/Button';
import MessageIcon from '../../assets/icons/Icons=Envelope.svg';
import InviteButton from './InviteButton';

type Props = {
  invited: boolean;
  providerId: string;
  onMessage: () => void;
  onAddFavorites: () => void;
  projectId?: string;
  className?: string;
};

const ActionButtonsGroup = ({ invited, providerId, onAddFavorites, onMessage, projectId, className }: Props) => {
  return (
    <div className={`flex gap-4 flex-wrap items-center justify-center ${className || ''}`}>
      <button onClick={onAddFavorites}>
        <HeartIcon className="fill-main-secondary" />
      </button>
      <div className="flex gap-4 flex-col sm:flex-row">
        <Button onClick={onMessage} color={'secondary'} className="border-0 hover:border-0 rounded !h-[50px]">
          Message
          <MessageIcon className="stroke-accent-white stroke-2" />
        </Button>
        <InviteButton invited={invited} providerId={providerId} projectId={projectId} />
      </div>
    </div>
  );
};

export default ActionButtonsGroup;
