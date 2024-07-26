import React, { Dispatch, SetStateAction } from 'react';
import { NAV_USER_ACCOUNT } from '../../../../utils/navigation';
import VerticalNavItem from '../../../../components/navigation/VerticalNavItem';
import { Nav } from '../../../../types/nav';

type Props = {
  setSelectedTab: Dispatch<SetStateAction<string>>;
  selectedTab: string;
};

const VerticalNav = ({ setSelectedTab, selectedTab }: Props) => {
  const navClickHandler = (navItem: Nav) => {
    setSelectedTab(navItem.name);
  };

  return (
    <div className="border-[1px] border-border-default bg-white lg:w-[35%]">
      <div className="px-8 py-7">
        <h3 className="font-montserrat text-4xl font-medium">Account</h3>
      </div>
      <ul>
        {NAV_USER_ACCOUNT.map((item) => (
          <VerticalNavItem
            className="border-none"
            key={item.name}
            navItem={item}
            selected={selectedTab === item.name}
            onNavClick={navClickHandler}
          />
        ))}
      </ul>
    </div>
  );
};

export default VerticalNav;
