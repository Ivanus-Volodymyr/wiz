import React from 'react';

import { Nav } from '../types/nav';

import { usePathname, useRouter } from 'next/navigation';

import { useDispatch } from '../store';
import { logout } from '../store/projects';

type Props = {
  navItem: Nav;
  onClose: () => void;
};

const AccountNavItem = ({ navItem, onClose }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const splitPath = pathname.split('/');
  const selected = `/${splitPath[splitPath.length - 1]}` === navItem.link;

  const navLinkClickHandler = () => {
    onClose();
    if (navItem.name === 'Log out') {
      dispatch(logout());
      return;
    }
    router.push(navItem.link);
  };

  return (
    <li
      onClick={navLinkClickHandler}
      className={`${selected ? 'bg-content-tertiary text-[#fff]' : ''} hover:bg-content-warm cursor-pointer`}
    >
      <div className="flex justify-center lg:justify-normal lg:px-7 h-[64px] gap-6 py-5 items-center">
        <div className="w-6 stroke-main-secondary fill-main-secondary">{navItem.icon}</div>
        <p>{navItem.name}</p>
      </div>
    </li>
  );
};

export default AccountNavItem;
