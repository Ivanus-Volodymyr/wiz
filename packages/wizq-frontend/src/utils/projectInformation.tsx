import React from 'react';
import LockIcon from '../assets/icons/Icons=lock, Property 1=Variant55.svg';
import GlobeIcon from '../assets/icons/Icons=globe, Property 1=Wizquotes icon.svg';

export const IS_PRIVATE_VALUES = [
  {
    value: true,
    name: 'Private',
    icon: <LockIcon className="stroke-main-primary" />,
  },
  {
    value: false,
    name: 'Public',
    icon: <GlobeIcon className="stroke-main-primary   " />,
  },
];

export const MANAGE_SP_TABS = ['Matched', 'Contacted', 'Proposals'];
