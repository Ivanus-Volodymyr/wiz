import React, { useState } from 'react';
import Button from '../common/Button';
import { useSelector } from '../../store';
import { useSetInviteDesignerMutation, useSetInviteWithdrawDesignerMutation } from '../../store/projects';

type Props = {
  invited: boolean;
  projectId?: string;
  providerId: string;
};

const InviteButton = ({ invited, projectId, providerId }: Props) => {
  const [setInviteProvider] = useSetInviteDesignerMutation();
  const [setInviteWithdrawProvider] = useSetInviteWithdrawDesignerMutation();

  const authInfo = useSelector((state) => state.auth.user);
  const selectedProject = useSelector((state) => state.project.selectedProject);

  const inviteValue = {
    authorId: authInfo?.id,
    projectId: selectedProject?.id || projectId,
    providerId,
  };

  const inviteHandler = async () => {
    await setInviteProvider(inviteValue);
  };

  const withdrawHandler = async () => {
    await setInviteWithdrawProvider(inviteValue);
  };

  return (
    <>
      {invited ? (
        <Button
          color="primary"
          className="bg-white border border-[#017EFF] rounded !text-base !text-[#017EFF] hover:!bg-label-disableBG !h-[50px] !px-6 w-[226px] min-w-[204px]"
          onClick={withdrawHandler}
        >
          Withdraw invitation
        </Button>
      ) : (
        <Button
          color="primary"
          className="border-0 hover:border-0 rounded !h-[50px] w-[226px] !px-6"
          onClick={inviteHandler}
        >
          Invite to project
        </Button>
      )}
    </>
  );
};

export default InviteButton;
