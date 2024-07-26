'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { NAV_ITEMS_HOMEOWNER, NAV_ITEMS_SERVICE_PROVIDER } from '../utils/navigation';
import { useSelector } from '../store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGetNotificationsQuery } from '../store/projects';
import Notifications from '../components/notifications/Notifications';
import Badge from '../components/common/Badge';
import { Account, MobileNav, AccountNav } from './index';

import MessagesIcon from '../assets/icons/messages.svg';
import BellIcon from '../assets/icons/bell.svg';
import ChevronDownIcon from '../assets/icons/Icons=Chevron-Down.svg';
import ChevronUpIcon from '../assets/icons/Icons=Chevron-Up.svg';
import BurgerMenuIcon from '../assets/icons/burger-menu.svg';
import CloseIcon from '../assets/icons/Icons=Times.svg';
import classNames from 'classnames';

interface HeaderProps {
  visible: boolean;
}

export default function Header({ visible }: HeaderProps) {
  const pathname = usePathname();
  const user = useSelector((state) => state.auth.user);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isAccountNavOpen, setIsAccountNavOpen] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { data: notifications } = useGetNotificationsQuery(user?.id);

  const unreadNotifications = () => {
    return notifications?.find((el) => !el.details.is_read);
  };

  const NavItems = user.userType === 'HOME_OWNER' ? NAV_ITEMS_HOMEOWNER : NAV_ITEMS_SERVICE_PROVIDER;

  const dropdownRef = useRef<HTMLUListElement>();

  useEffect(() => {
    if (isMobileNavOpen) {
      const handleOutsideClick = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && isMobileNavOpen === true) {
          setIsMobileNavOpen(false);
        }
      };

      document.addEventListener('click', handleOutsideClick);

      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    }
  }, [isMobileNavOpen]);

  return (
    <>
      {visible && (
        <>
          <header
            className={classNames({
              'w-full flex gap-4 justify-between items-center px-4 lg:px-12 h-[137px] fixed bg-background-default z-30':
                true,
              'border-b-[1px] border-b-[#DBDBDB]': pathname !== '/business',
              'bg-opacity-0': pathname === '/business',
            })}
          >
            <div className="flex gap-2 items-center">
              <div className="lg:hidden cursor-pointer" onClick={() => setIsMobileNavOpen((prevState) => !prevState)}>
                {isMobileNavOpen ? (
                  <CloseIcon className="fill-[#1C3C80]" />
                ) : (
                  <BurgerMenuIcon className="stroke-[#1C3C80]" />
                )}
              </div>
              <Link href="/">
                <Image
                  src="/assets/logo.svg"
                  alt="WizQuotes"
                  width="208"
                  height="38"
                  className="hidden lg:block w-24 lg:w-52"
                />
                <Image
                  src="/assets/wizquotes-no-text.svg"
                  alt="WizQuotes"
                  width="24"
                  height="24"
                  className="lg:hidden"
                />
              </Link>
            </div>

            {pathname !== '/business' && (
              <>
                {pathname !== '/business/steps' && (
                  <ul className="hidden md:flex gap-12 items-center">
                    {NavItems.map((item) => (
                      <li key={item.name}>
                        <Link href={item.link}>
                          <span className="text-base font-medium text-[#0D1835]">{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex items-center gap-8 relative">
                  {pathname !== '/business/steps' && (
                    <>
                      <div className="relative hidden lg:block">
                        <MessagesIcon className="w-6 h-6 cursor-pointer" />
                      </div>
                      <div className="relative">
                        <BellIcon
                          onClick={() => {
                            setIsNotificationsOpen((prevState) => !prevState);
                            setIsAccountNavOpen(false);
                          }}
                          className="w-6 h-6 cursor-pointer"
                        />
                        {unreadNotifications() && <Badge className="animate-bounce absolute top-0 right-0" />}
                      </div>
                    </>
                  )}

                  <Account
                    onAvatarClick={() => {
                      setIsAccountNavOpen((prevState) => !prevState);
                      setIsNotificationsOpen(false);
                    }}
                    isOnline={true}
                  />
                  <div
                    onClick={() => {
                      setIsAccountNavOpen((prevState) => !prevState);
                      setIsNotificationsOpen(false);
                    }}
                    className="cursor-pointer hidden lg:block"
                  >
                    {isAccountNavOpen ? (
                      <ChevronUpIcon className="fill-main-secondary" />
                    ) : (
                      <ChevronDownIcon className="fill-main-secondary" />
                    )}
                  </div>
                </div>
              </>
            )}
          </header>
          <AccountNav isVisible={isAccountNavOpen} onClose={() => setIsAccountNavOpen(false)} />
          <Notifications onClose={() => setIsNotificationsOpen(false)} isVisible={isNotificationsOpen} />
          <MobileNav ref={dropdownRef} navItems={NavItems} open={isMobileNavOpen} />
        </>
      )}
    </>
  );
}
