import React from 'react';
import ProjectsListItem from './ProjectsListItem';
import { LoadProjectResponse } from '../../../types/project';

type Props = {
  projects: LoadProjectResponse[];
};

const ProjectsList = ({ projects }: Props) => {
  return (
    <div className="flex flex-col gap-7">
      {projects?.map((project) => (
        <ProjectsListItem key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectsList;
