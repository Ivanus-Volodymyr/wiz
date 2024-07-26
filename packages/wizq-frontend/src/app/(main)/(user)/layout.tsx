import React from 'react';

type Props = {
  children: React.ReactNode;
};

const UserLayout = ({ children }: Props) => {
  return <div className="py-[5%] px-[2%] md:px-[12%] bg-background-subtleNeutral min-h-full">{children}</div>;
};

export default UserLayout;
