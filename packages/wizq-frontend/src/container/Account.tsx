import React from 'react';
import Avatar from '../components/common/Avatar';
import { UserType1 } from '../types';
import { useSelector } from '../store';

type Props = {
  isOnline?: boolean;
  avatarWidth?: number;
  avatarHeight?: number;
  onAvatarClick?: () => void;
};

const Account = ({ isOnline, avatarWidth, avatarHeight, onAvatarClick }: Props) => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="flex items-center gap-6 w-[32px] h-[32px] lg:h-auto lg:w-auto">
      <Avatar
        onClick={onAvatarClick}
        avatar={user?.picture}
        isOnline={isOnline}
        width={avatarWidth}
        height={avatarHeight}
      />
      <div className="hidden xl:block">
        <p className="font-bold text-base text-[#0D1835]">{user?.firstName || user?.email?.split('@')[0]}</p>
        <p className="text-sm text-[#3E4B6D]">
          {user?.userType === UserType1.HOME_OWNER ? 'Homeowner' : 'Service provider'}
        </p>
      </div>
    </div>
  );
};

export default Account;
