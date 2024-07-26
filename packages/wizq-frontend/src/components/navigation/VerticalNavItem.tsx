import React, { useState } from 'react';
import { Nav } from '../../types/nav';
import classNames from 'classnames';

type Props = {
  navItem: Nav;
  selected: boolean;
  onNavClick: (navItem: Nav) => void;
  className?: string;
};

const VerticalNavItem = ({ navItem, selected, onNavClick, className }: Props) => {
  const [hovered, setHovered] = useState(false);

  return (
    <li
      onClick={() => onNavClick(navItem)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={classNames({
        'cursor-pointer border-b-[1px] border-b-[#CDD6EC]': true,
        'bg-[#017EFF] text-[#fff]': selected || hovered,
      })}
    >
      <div className="flex justify-center lg:justify-normal lg:px-7 h-[64px] gap-6 py-5 items-center">
        <div
          className={classNames({
            'stroke-main-secondary fill-main-secondary': true,
            '!stroke-white !fill-white': selected || hovered,
          })}
        >
          {navItem.icon}
        </div>
        <p className="hidden lg:block">{navItem.name}</p>
      </div>
    </li>
  );
};

export default VerticalNavItem;
