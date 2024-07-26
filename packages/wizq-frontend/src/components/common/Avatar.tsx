import React from 'react';
import Image from 'next/image';
import classNames from 'classnames';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  avatar: string;
  isOnline?: boolean;
  width?: number;
  height?: number;
}

const Avatar = ({ avatar, isOnline, width = 64, height = 64, ...props }: Props) => {
  return (
    <div
      {...props}
      className={classNames({
        [`relative max-h-[${height}px] w-[${width}px]`]: true,
        [props.className]: !!props.className,
      })}
    >
      <Image width={width} height={height} alt="avatar" src={avatar} className={`rounded-full max-w-[${width}px]`} />

      {isOnline && (
        <div
          className={`absolute w-4 h-4 rounded-full border-2 border-accent-white bg-[#34BE6D] bottom-[-6px] lg:bottom-0 ${
            width === 96 ? 'right-[10px]' : 'right-[-6px] lg:right-0'
          }`}
        ></div>
      )}
    </div>
  );
};

export default Avatar;
