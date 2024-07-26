'use client';
import React, { useState } from 'react';

type Props = {
  children: React.ReactNode;
  text: string;
  className?: string;
};

const Tooltip = ({ children, text, className }: Props) => {
  const [hovered, setHovered] = useState<boolean>(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`${className || ''} relative`}
    >
      {children}
      {hovered && (
        <div className="absolute rounded-[2px] before:absolute before:-z-10 before:block before:content-[''] before:translate-x-[-50%] before:rotate-45 before:left-[50%] before:top-[-15%] before:w-[15px] before:h-[15px] before:bg-main-secondary bg-main-secondary text-sm text-accent-white py-2 px-4 translate-x-[-50%] whitespace-nowrap left-[50%] mt-2">
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
