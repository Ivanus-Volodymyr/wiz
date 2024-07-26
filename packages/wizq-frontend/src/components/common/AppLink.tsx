import React, { MouseEvent } from 'react';
import classNames from 'classnames';

interface Props extends React.HTMLProps<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
  color: 'primary' | 'secondary';
  onClick?: (evt: MouseEvent) => void;
}

const AppLink = ({ children, color, onClick, className, ...props }: Props) => {
  return (
    <span
      onClick={onClick ? onClick : undefined}
      {...props}
      className={classNames({
        'cursor-pointer active:text-main-active': true,
        'text-main-primary hover:text-hover-primary': color === 'primary',
        'text-main-secondary hover:text-hover-secondary': color === 'secondary',
        [className]: !!className,
      })}
    >
      {children}
    </span>
  );
};

export default AppLink;
