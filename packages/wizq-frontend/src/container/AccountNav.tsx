import React, { useEffect, useRef } from 'react';
import { AccountNavItem } from './index';
import { NAV_ACCOUNT } from '../utils/navigation';
import Avatar from '../components/common/Avatar';
import { UserType1 } from '../types';
import { useSelector } from '../store';

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

const AccountNav = ({ isVisible, onClose }: Props) => {
  const user = useSelector((state) => state.auth.user);
  const accountNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      const handleOutsideClick = (event: MouseEvent) => {
        if (accountNavRef.current && !accountNavRef.current.contains(event.target as Node)) {
          onClose();
        }
      };

      document.addEventListener('click', handleOutsideClick);
      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    }
  }, [isVisible, onClose]);

  if (!isVisible) return;

  return (
    <div>
      <div className="lg:hidden bg-main-secondary opacity-30 fixed w-full h-full top-0 left-0 z-[1]"></div>
      <div
        ref={accountNavRef}
        className="p-3 bg-white drop-shadow shadow-[#0D18351A] w-full md:w-1/2 md:h-full right-0 lg:w-[326px] lg:h-auto lg:right-9 lg:left-[auto] fixed top-[137px] lg:top-[116px] lg:z-[31] overflow-hidden z-[3]"
      >
        <div className="py-6 px-6 flex justify-center lg:justify-start">
          <div className="flex items-center gap-6">
            <Avatar avatar={user?.picture} />
            <div>
              <p className="font-bold text-base text-[#0D1835]">{user?.firstName || user?.email?.split('@')[0]}</p>
              <p className="text-sm text-[#3E4B6D]">
                {user?.userType === UserType1.HOME_OWNER ? 'Homeowner' : 'Service provider'}
              </p>
            </div>
          </div>
        </div>
        <ul className="overflow-auto">
          {NAV_ACCOUNT.map((item) => (
            <AccountNavItem onClose={onClose} key={item.name} navItem={item} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AccountNav;
