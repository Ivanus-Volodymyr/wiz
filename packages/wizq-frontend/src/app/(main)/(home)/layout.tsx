'use client';

import React from 'react';
import { NAV_HOME } from '../../../utils/navigation';
import { usePathname, useRouter } from 'next/navigation';
import VerticalNavItem from '../../../components/navigation/VerticalNavItem';
import { Nav } from '../../../types/nav';

type Props = {
  children: React.ReactNode;
};

const HomeLayout = ({ children }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const navClickItemHandler = (navItem: Nav) => {
    router.push(navItem.link);
  };

  return (
    <>
      <ul className="border-[1px] border-[#CDD6EC] border-t-0 border-l-0 w-[16%] bg-background-default fixed h-full overflow-auto">
        <li className="flex px-7 gap-6 py-5 border-b-[1px] border-b-[#CDD6EC] h-[64px]"></li>
        {NAV_HOME.map((item) => (
          <VerticalNavItem
            onNavClick={navClickItemHandler}
            navItem={item}
            selected={item.link === `/${pathname.split('/')[1]}`}
            key={item.link}
          />
        ))}
        <li className="flex px-7 gap-6 py-5 h-[64px]"></li>
        <li className="flex px-7 gap-6 py-5 h-[64px]"></li>
      </ul>
      <div className="bg-background-subtleNeutral pl-[16%] h-full">{children}</div>
    </>
  );
};

export default HomeLayout;
