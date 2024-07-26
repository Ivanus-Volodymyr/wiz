'use client';

import React from 'react';
import ProjectsList from './ProjectsList';
import { useGetProjectsByAuthIdQuery } from '../../../store/projects';
import { useSelector } from '../../../store';

const ProjectsPage = () => {
  const authInfo = useSelector((state) => state.auth.user);
  const { data: projects } = useGetProjectsByAuthIdQuery(authInfo?.id);

  return (
    <div className="pt-[75px] md:px-[7%] lg:pt-[80px] bg-background-subtleNeutral h-full">
      <ProjectsList projects={projects} />
    </div>
  );
};

export default ProjectsPage;
