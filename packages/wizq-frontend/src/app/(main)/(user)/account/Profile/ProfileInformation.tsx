import React, { useRef } from 'react';
import Avatar from '../../../../../components/common/Avatar';
import { useSelector } from '../../../../../store';
import Plus from '../../../../../assets/icons/Icons=Plus.svg';
import { UserType1 } from '../../../../../types';

const ProfileInformation = () => {
  const user = useSelector((state) => state.auth.user);

  const avatarInputRef = useRef<HTMLInputElement>();

  const handleFileBrowser = () => {
    avatarInputRef.current.click();
  };

  const editUserAvatarHandler = () => {};

  return (
    <div>
      <div className="px-[7%] pt-12 pb-10 border-b-[1px] border-border-default">
        <h4 className="text-2xl font-montserrat">Profile information</h4>
        <div className="flex flex-col lg:flex-row mt-[90px] gap-9 items-center">
          <div className="relative">
            <input ref={avatarInputRef} type="file" className="hidden" onChange={editUserAvatarHandler} />
            <label className="cursor-pointer" onClick={handleFileBrowser}>
              <Avatar avatar={user.picture} width={96} height={96} />
              <div className="absolute bg-main-primary p-1 bottom-[-7px] right-[-7px]">
                <Plus className="fill-accent-white" />
              </div>
            </label>
          </div>
          <div>
            <p className="font-bold font-montserrat text-xl">{user?.firstName || user?.email.split('@')[0]}</p>
            <p className="mt-3">{user?.userType === UserType1.HOME_OWNER ? 'Homeowner' : 'Service provider'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInformation;
