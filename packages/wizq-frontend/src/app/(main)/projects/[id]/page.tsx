'use client';

import React from 'react';
import ProjectInformation from './ProjectInformation';
import ManageSPs from './ManageSPs';

type Props = {
  params: { id: string };
};

const SingleProjectPage = ({ params }: Props) => {
  return (
    <div className="flex flex-col xl:flex-row">
      <ProjectInformation projectId={params?.id} />
      <ManageSPs projectId={params?.id} />
    </div>
  );
};

export default SingleProjectPage;
