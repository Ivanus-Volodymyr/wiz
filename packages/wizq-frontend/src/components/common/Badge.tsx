import React from 'react';

interface Props extends React.HTMLProps<HTMLDivElement> {
  className?: string;
}

const Badge = ({ className, ...props }: Props) => {
  return (
    <div {...props} className={`${className || ''} w-[10px] h-[10px] bg-main-primary border-2 border-white`}></div>
  );
};

export default Badge;
