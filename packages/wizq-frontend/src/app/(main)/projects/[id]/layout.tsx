'use client';

import React from 'react';
import { useGetSelectedProjectQuery } from '../../../../store/projects';

type Props = {
  children: React.ReactNode;
  params: { id: string };
};

const SingleProjectLayout = ({ children, params }: Props) => {
  useGetSelectedProjectQuery(params?.id);

  return <div className="lg:p-[5.7%] bg-background-subtleNeutral min-h-full">{children}</div>;
};

export default SingleProjectLayout;
