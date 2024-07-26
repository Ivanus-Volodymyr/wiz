import React from 'react';
import IconSprite from './IconSprite';
import { ArrayElement } from '../../../types';

export const iconNames = [
  'undo',
  'redo',
  'check',
  'heart',
  'erase',
  'times',
  'envelope',
  'image',
  'minus',
  'mark',
  'badge',
  'eye',
  'luggage',
  'save',
  'wallet',
  'arrow-left',
  'arrow-right',
  'arrow-down',
  'arrow-up',
  'star',
  'upload',
  'info-cirlce',
  'eye-slash',
  'user-circle',
  'message',
  'plus',
  'list',
  'interest',
  'pencil',
  'trash',
  'payment-card',
  'news',
  'bell',
  'map',
  'chevron-left',
  'chevron-right',
  'chevron-up',
  'chevron-down',
  'book',
  'users',
  'chart-pie',
  'building',
  'calendar',
  'filter',
  'paper-plane',
  'thumbs-up',
  'arrow-right-large',
  'pen',
  'floor-plan',
  'user',
  'lock',
  'location',
  'wage',
  'briefcase',
  'eyeslash',
  'search',
] as const;

export type IconName = ArrayElement<typeof iconNames>;

interface Props {
  name: IconName;
  size?: number;
  className?: string;
  onClick?: () => void;
}

const Icon = ({ name, size = 26, className, onClick }: Props) => {
  return (
    <svg onClick={onClick} className={className} data-icon-name={name} width={size} height={size} viewBox="0 0 20 16">
      <use xlinkHref={`#icon-${name}`} />
      <defs>
        <IconSprite />
      </defs>
    </svg>
  );
};

export default Icon;
