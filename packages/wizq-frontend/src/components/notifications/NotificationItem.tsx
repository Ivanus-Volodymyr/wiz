import React, { useState } from 'react';
import Avatar from '../common/Avatar';
import { Notification } from '../../types/notification';
import { fDateWeek, TimeAgo } from '../../utils/formatTime';
import Button from '../common/Button';
import { useRouter } from 'next/navigation';
import DeleteIcon from '../../assets/icons/Icons=Times.svg';
import { setManageSPTab, setSelectedProposal, useDeleteNotificationByIdMutation } from '../../store/projects';
import { useDispatch } from '../../store';

type Props = {
  notificationData: Notification;
  onClose: () => void;
};

const NotificationItem = ({ notificationData, onClose }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const [deleteNotification] = useDeleteNotificationByIdMutation();

  const viewProposalClickHandler = () => {
    router.replace(`/projects/${notificationData.details.projectProposal.projectId}`);
    dispatch(setManageSPTab('Proposals'));
    dispatch(setSelectedProposal(notificationData.details.projectProposal.id));
    onClose();
  };

  const deleteNotificationHandler = async () => {
    await deleteNotification(notificationData.id);
  };

  return (
    <div
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`${
        !notificationData.details.is_read ? 'bg-content-warm' : ''
      } border-b-[1px] border-b-border-default p-5 flex space-x-5`}
    >
      <Avatar width={32} height={32} avatar={notificationData.details.author.picture} />
      {notificationData.type === 'PROPOSALS' && (
        <div>
          <p>
            <span className="font-bold">
              {notificationData.details.author.firstName} {notificationData.details.author.lastName}
            </span>{' '}
            sent you a proposal for your{' '}
            <span className="font-bold">{notificationData.details.projectProposal.project.name}</span> project
          </p>
          <p className="text-content-secondary">
            {fDateWeek(notificationData.details.createdAt)} | {TimeAgo(notificationData.details.createdAt)}
          </p>
          <Button
            onClick={viewProposalClickHandler}
            color="primary"
            className="mt-6 rounded-[3px] py-2 h-auto px-4"
            outline={true}
          >
            View proposal
          </Button>
        </div>
      )}
      {notificationData.type === 'INVITATION' && (
        <div>
          <p>
            <span className="font-bold">
              {notificationData.details.author.firstName} {notificationData.details.author.lastName}
            </span>{' '}
            sent you an invitation for{' '}
            <span className="font-bold">{notificationData.details.projectInvitation.project.name}</span> project
          </p>
          <p className="text-content-secondary">
            {fDateWeek(notificationData.details.createdAt)} | {TimeAgo(notificationData.details.createdAt)}
          </p>
          <Button color="primary" className="mt-6 rounded-[3px] py-2 h-auto px-4" outline={true}>
            View invitation
          </Button>
        </div>
      )}
      <div>
        <DeleteIcon onClick={deleteNotificationHandler} className="fill-main-secondary cursor-pointer" />
      </div>
    </div>
  );
};

export default NotificationItem;
