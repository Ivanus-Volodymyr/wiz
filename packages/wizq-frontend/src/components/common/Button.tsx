'use client';
import classNames from 'classnames';
import React, { MouseEvent, ReactNode, useEffect, useState } from 'react';
import Spinner from './Spinner';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: 'primary' | 'secondary' | 'success';
  block?: boolean; // 100% wide
  disabled?: boolean;
  isLoading?: boolean;
  outline?: boolean; // white button with colored border
  className?: string;
  form?: string;
  children: ReactNode;
  onClick?: (evt: MouseEvent) => void;
}

const Button = ({
  color,
  className,
  form,
  children,
  disabled,
  isLoading,
  block,
  outline,
  onClick,
  ...props
}: Props) => {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {}, []);

  return (
    <button
      {...props}
      form={form}
      onClick={!disabled && !isLoading ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
      className={classNames({
        'font-karla': true,
        'text-base font-bold px-14 h-[68px] relative': true,
        'w-full block': block,
        'cursor-not-allowed text-label-disable': disabled,
        '!text-hover-secondary': (disabled && hovered) || (disabled && !outline && hovered),
        'border bg-white': outline,
        '!outline !outline-1': outline && hovered,
        'text-white': !outline && !disabled,

        'bg-label-disable-light text-label-disable': disabled && !outline,
        'border-label-disable': disabled && outline,
        '!border-hover-secondary !outline-hover-secondary': disabled && outline && hovered,

        'bg-main-primary': !disabled && !outline && color === 'primary',
        '!bg-main-primary-darker': !disabled && !outline && color === 'primary' && hovered,
        'border-main-primary outline-main-primary text-main-primary': !disabled && outline && color === 'primary',

        'bg-main-secondary': !disabled && !outline && color === 'secondary',
        '!bg-hover-secondary': !disabled && !outline && color === 'secondary' && hovered,
        'border-main-secondary outline-main-secondary text-main-secondary':
          !disabled && outline && color === 'secondary',

        'bg-accent-green': !disabled && !outline && color === 'success',
        '!bg-hover-proceed': !disabled && !outline && color === 'success' && hovered,
        'border-accent-green outline-accent-green text-accent-green': !disabled && outline && color === 'success',
        '!border-state-success !outline-state-success !text-state-success':
          !disabled && outline && color === 'success' && hovered,
        [className as string]: !!className,
      })}
    >
      <div className={`${isLoading ? 'opacity-0' : ''} flex gap-5 items-center justify-center`}>{children}</div>
      <div className="absolute w-full h-full left-0 top-0 flex items-center justify-center">
        {isLoading && <Spinner className="!w-6 !h-6" theme="light" />}
      </div>
    </button>
  );
};

export default Button;
