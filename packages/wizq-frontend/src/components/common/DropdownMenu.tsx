import React, { forwardRef, useState, useEffect } from 'react';
import classNames from 'classnames';

import ChevronDown from '../../assets/icons/Icons=Chevron-Down.svg';

export type DropdownMenuItemType = {
  name: string;
  index: string;
  icon?: JSX.Element;
};

export interface DropdownMenuProps {
  color?: 'primary' | 'secondary' | 'success';
  items: DropdownMenuItemType[];
  selectItem: DropdownMenuItemType;
  placeholder?: string;
  defaultIcon?: JSX.Element;
  isShow: boolean;
  setDropMenu: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectItem: (item: DropdownMenuItemType) => void;
}

const DropdownMenu = forwardRef<HTMLInputElement, DropdownMenuProps>(
  ({ color, items, selectItem, placeholder, defaultIcon, isShow, setDropMenu, onSelectItem, ...props }, ref) => {
    return (
      <div className="relative">
        <button
          className={classNames(
            `font-karla text-base font-bold px-6 h-[50px] rounded text-[#0D1835] hover:outline-none hover:border-hover-secondary mb-2`,
            {
              'bg-main-primary hover:bg-main-primary-darker hover:border-hover-primary text-white': color === 'primary',
              'bg-main-secondary hover:bg-hover-secondary hover:border-hover-secondary text-white':
                color === 'secondary',
              'bg-state-success hover:bg-hover-proceed hover:border-hover-proceed text-white': color === 'success',
            }
          )}
          onClick={() => setDropMenu((prevState) => !prevState)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {defaultIcon ? (
                <div className="mr-4">{defaultIcon}</div>
              ) : selectItem?.icon ? (
                <div className="mr-4">{selectItem?.icon}</div>
              ) : (
                <></>
              )}

              {!selectItem && <span>{placeholder}</span>}

              {selectItem && <span>{selectItem?.name}</span>}
            </div>
            <ChevronDown
              className={`${color ? 'fill-white' : 'fill-main-secondary'} ml-5 transition ${
                isShow ? 'rotate-[-180deg]' : 'rotate-0'
              }`}
            />
          </div>
        </button>

        {isShow && (
          <div className={`border border-[#CDD6EC] table absolute z-50 bg-white`}>
            {items.map((rs: DropdownMenuItemType, key: number) => (
              <div
                key={key}
                className={`h-12 px-4 flex items-center cursor-pointer hover:bg-[#CDD6EC] ${
                  selectItem?.index === rs.index ? 'bg-[#CDD6EC]' : 'bg-white'
                }`}
                onClick={() => onSelectItem(rs)}
              >
                {rs.icon && <div className="mr-4 w-5 h-5">{rs.icon}</div>}
                <span>{rs.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

DropdownMenu.displayName = 'DropdownMenu';
export default DropdownMenu;
