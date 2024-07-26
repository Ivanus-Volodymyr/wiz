import React from 'react';
import { LoadProjectResponse } from '../../../types/project';
import AppLink from '../../../components/common/AppLink';
import Button from '../../../components/common/Button';
import { useRouter } from 'next/navigation';
import { useDeleteProjectMutation } from '../../../store/projects';

type Props = {
  project: LoadProjectResponse;
};

const ProjectsListItem = ({ project }: Props) => {
  const router = useRouter();

  const goToProjectHandler = () => {
    router.push(`/projects/${project.id}`);
  };

  const [deleteProject] = useDeleteProjectMutation();

  const deleteProjectHandler = async () => {
    await deleteProject(project.id);
  };

  return (
    <div className="bg-label-white p-7 border-[#CDD6EC] border-[1px] flex justify-between flex-col sm:flex-row items-center gap-5">
      <div className="space-y-5">
        <div className="flex gap-5">
          <AppLink onClick={goToProjectHandler} className="font-bold" color="primary">
            #{project.id.split('-')[0]}
          </AppLink>
          <p className="font-bold text-lg">{project.name}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-5">
          Invites: <span className="font-bold">{project?.projectInvitation?.length || 0}</span>
          Proposals: <span className="font-bold">{project?.proposals?.length || 0}</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-5">
        <Button onClick={goToProjectHandler} color="primary">
          View
        </Button>
        <Button onClick={deleteProjectHandler} color="secondary">
          Delete
        </Button>
      </div>
    </div>
  );
};

export default ProjectsListItem;
