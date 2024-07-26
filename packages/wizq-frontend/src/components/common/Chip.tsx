import React from 'react';

type Props = {
  className?: string;
  children: React.ReactNode;
};

const Chip = ({ children, className }: Props) => {
  return (
    <div
      className={`flex gap-2 items-center justify-center px-3 py-2 font-medium text-sm text-content-secondary bg-[#EFF1F5] ${
        className ? className : ''
      }`}
    >
      {children}
    </div>
  );
};

export default Chip;
