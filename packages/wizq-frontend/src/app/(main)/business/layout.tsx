import React, { ReactNode } from 'react';

interface BusinessLayoutProps {
  children: ReactNode;
}

export default function BusinessLayout({ children }: BusinessLayoutProps) {
  return (
    <div className="w-full py-20 px-8 md:px-16 xl:pb-16 xl:px-56 flex flex-col">
      <div>{children}</div>
    </div>
  );
}
