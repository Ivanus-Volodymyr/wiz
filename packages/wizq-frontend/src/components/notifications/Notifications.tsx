import React, { useEffect, useRef, useState } from 'react';
import NotificationItem from './NotificationItem';
import { useGetNotificationsQuery } from '../../store/projects';
import { useSelector } from '../../store';
import Button from '../common/Button';
import classNames from 'classnames';

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

const Notifications = ({ isVisible, onClose }: Props) => {
  const [viewAll, setViewAll] = useState<boolean>(false);

  const { user } = useSelector((state) => state.auth);
  const { data: notifications } = useGetNotificationsQuery(user?.id);

  const notificationsRef = useRef<HTMLDivElement>(null);

  const viewAllNotificationsHandler = () => {
    setViewAll((prevState) => !prevState);
  };

  useEffect(() => {
    if (isVisible) {
      const handleOutsideClick = (event: MouseEvent) => {
        if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
          onClose();
        }
      };

      document.addEventListener('click', handleOutsideClick);
      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    }
  }, [isVisible, onClose]);

  if (!isVisible) {
    return;
  }

  return (
    <div>
      <div className="lg:hidden bg-main-secondary opacity-30 fixed w-full h-full top-0 left-0 z-[1]"></div>
      <div
        ref={notificationsRef}
        className={classNames({
          'bg-white drop-shadow shadow-[#0D18351A] w-full md:w-1/2 right-0 lg:w-[425px] xl:right-[250px] lg:left-[auto] fixed top-[137px] lg:top-[116px] lg:z-[31] overflow-hidden z-[3]':
            true,
          'h-full lg:h-auto pb-[274px] lg:pb-0': viewAll,
        })}
      >
        <div className="relative h-full lg:h-auto">
          <div className="border-b-[1px] border-b-border-default px-5 py-3">
            <p className="font-bold text-lg">Notifications</p>
          </div>
          <div className="overflow-y-auto max-h-full lg:max-h-[60vh]">
            {notifications
              ?.slice(viewAll ? 0 : -3)
              .reverse()
              .map((item, index) => (
                <NotificationItem onClose={onClose} key={index} notificationData={item} />
              ))}
          </div>
          <Button
            color="primary"
            outline={true}
            className="border-0 hover:text-main-hover hover:outline-none active:text-main-active w-full bottom-0 left-0 py-3"
            onClick={viewAllNotificationsHandler}
          >
            {viewAll ? 'Hide all notifications' : 'View all notifications'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
