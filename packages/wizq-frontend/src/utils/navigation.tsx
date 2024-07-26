import React from 'react';

import { Nav } from '../types/nav';
import ChartIcon from '../assets/icons/Icons=Chart-Pie.svg';
import BudgetIcon from '../assets/icons/Icons=Payment Card.svg';
import MyTaskIcon from '../assets/icons/check-square.svg';
import ContractsIcon from '../assets/icons/contracts.svg';
import ServiceProviderIcon from '../assets/icons/briefcase.svg';
import BlogsIcon from '../assets/icons/Icons=News.svg';
import TopicsIcon from '../assets/icons/Icons=Book.svg';
import UserIcon from '../assets/icons/Icons=User.svg';
import SettingsIcon from '../assets/icons/Icons=Gear, Property 1=Wizquotes icon.svg';
import LocationIcon from '../assets/icons/Icons=location, Property 1=Variant55.svg';
import LogoutIcon from '../assets/icons/logout.svg';
import LockIcon from '../assets/icons/Icons=lock, Property 1=Variant55.svg';

export const NAV_ITEMS_HOMEOWNER: Record<'name' | 'link', string>[] = [
  {
    name: 'Find Profesionals',
    link: '',
  },
  {
    name: 'Shop & Stores',
    link: '',
  },
  {
    name: 'Community',
    link: '',
  },
  {
    name: 'Photos',
    link: '',
  },
];

export const NAV_ITEMS_SERVICE_PROVIDER: Record<'name' | 'link', string>[] = [
  {
    name: 'Find Profesionals',
    link: '',
  },
  {
    name: 'Shop & Stores',
    link: '',
  },
  {
    name: 'Community',
    link: '',
  },
  {
    name: 'Photos',
    link: '',
  },
];

export const NAV_HOME: Nav[] = [
  {
    name: 'Overview',
    link: '/overview',
    icon: <ChartIcon />,
  },
  {
    name: 'MyTask',
    link: '/mytask',
    icon: <MyTaskIcon />,
  },
  {
    name: 'Budgeting',
    link: '/budgeting',
    icon: <BudgetIcon className="stroke-none" />,
  },
  {
    name: 'Contracts',
    link: '/contracts',
    icon: <ContractsIcon />,
  },
  {
    name: 'Services Provider',
    link: '/services_provider',
    icon: <ServiceProviderIcon />,
  },
  {
    name: 'Blogs',
    link: '/blogs',
    icon: <BlogsIcon className="stroke-none" />,
  },
  {
    name: 'Trending Topics',
    link: '/trending_topics',
    icon: <TopicsIcon className="stroke-none" />,
  },
];

export const NAV_ACCOUNT: Nav[] = [
  {
    name: 'Account',
    link: '/account',
    icon: <UserIcon />,
  },
  {
    name: 'Settings',
    link: '/settings',
    icon: <SettingsIcon />,
  },
  {
    name: 'Help center',
    link: '/help-center',
    icon: <LocationIcon />,
  },
  {
    name: 'Log out',
    link: '#',
    icon: <LogoutIcon />,
  },
];

export const NAV_USER_ACCOUNT: Nav[] = [
  {
    name: 'Profile',
    link: '#',
    icon: <UserIcon />,
  },
  {
    name: 'Payment Methods',
    link: '#',
    icon: <BudgetIcon className="stroke-none" />,
  },
  {
    name: 'Password & security',
    link: '#',
    icon: <LockIcon />,
  },
];
