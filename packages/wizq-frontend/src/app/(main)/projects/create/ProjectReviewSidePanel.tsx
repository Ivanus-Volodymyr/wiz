import React from 'react';

import PauseIcon from '../../../../assets/icons/media.svg';
import FlagIcon from '../../../../assets/icons/flag.svg';
import PenIcon from '../../../../assets/icons/Icons=Pen.svg';

import { useDispatch, useSelector } from '../../../../store';
import Chip from '../../../../components/common/Chip';
import { useRouter } from 'next/navigation';
import { setCreateProjectStep } from '../../../../store/projects';

type Props = {
  isChoosingDesigner?: boolean;
};

const ProjectReviewSidePanel = ({ isChoosingDesigner }: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedProject = useSelector((state) => state.project.selectedProject);

  const updateChoiceHandler = () => {
    dispatch(setCreateProjectStep(2));
    router.push('/projects/create');
  };

  return (
    <div>
      <div className="border-[1px] border-[#CDD6EC]">
        {isChoosingDesigner && (
          <div className="flex gap-4 bg-[#FFEFC9] px-11 py-7">
            <div>
              <PauseIcon className="bg-accent-white rounded-full" />
            </div>
            <p className="font-medium">
              Your project has been put on hold because you chose to connect with a designer.{' '}
              <span className="cursor-pointer font-bold text-main-primary" onClick={updateChoiceHandler}>
                Update choice
              </span>
            </p>
          </div>
        )}
        <div className="bg-accent-white px-11 py-7">
          <div className="flex gap-3 items-center">
            <div>
              <FlagIcon />
            </div>
            <p className="font-montserrat text-xl font-medium">Project summary</p>
          </div>
          <h5 className="font-bold font-montserrat text-xl mt-10">{selectedProject.name}</h5>
          <div className="flex flex-wrap gap-2 mt-[10px]">
            {selectedProject.floor_plan === 'designer' ? (
              <>
                <Chip>
                  <div className="rounded-full w-[10px] h-[10px] bg-content-tertiary"></div>
                  <p>Not started</p>
                </Chip>
                <Chip>
                  <div>
                    <PenIcon className="stroke-content-secondary stroke-2" />
                  </div>
                  <p>Connecting with designer</p>
                </Chip>
              </>
            ) : (
              <>
                <Chip>
                  <div className="rounded-full w-[10px] h-[10px] bg-[#34BE6D]"></div>
                  <p>Project Published</p>
                </Chip>
                <Chip>
                  <div>
                    <PenIcon className="stroke-content-secondary stroke-2" />
                  </div>
                  <p>Connecting with Contractor</p>
                </Chip>
              </>
            )}
          </div>
          <div className="mt-10">
            <p>Description</p>
            <p className="mt-2">{selectedProject.description}</p>
          </div>
          <div className="mt-12">
            <p>Project address</p>
            <p className="font-bold mt-[10px]">{selectedProject.address}</p>
          </div>
          <div className="mt-16">
            <p>Project categories</p>
            <div className="flex flex-wrap gap-2 mt-[10px]">
              {selectedProject.categories.map((item) => (
                <div className="font-bold py-3 px-7 bg-[#E6F2FF]" key={item.id}>
                  {item.name}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 flex flex-wrap justify-between gap-4">
            <div>
              <p>Start date</p>
              <p className="font-bold mt-[10px]">{selectedProject.start_date}</p>
            </div>
            <div>
              <p>Visibility</p>
              <p className="font-bold mt-[10px]">{selectedProject.is_private ? 'Private' : 'Public'}</p>
            </div>
            <div>
              <p>Tasks</p>
              <p className="font-bold mt-[10px]">{`${selectedProject.project_tasks.length} tasks`}</p>
            </div>
          </div>
          <div className="mt-12">
            <p>Budget range</p>
            <p className="font-bold mt-[10px]">
              ${Number(selectedProject.min_budget).toLocaleString('en')} - $
              {Number(selectedProject.max_budget).toLocaleString('en')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectReviewSidePanel;
