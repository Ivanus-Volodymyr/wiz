import React, { useState } from 'react';
import { LoadProjectResponse } from '../../../../types/project';
import VerticalDotsIcon from '../../../../assets/icons/vertical-dots.svg';
import Chip from '../../../../components/common/Chip';
import { IS_PRIVATE_VALUES } from '../../../../utils/projectInformation';
import DocumentIcon from '../../../../assets/icons/Icons=document, Property 1=Variant55.svg';
import Link from 'next/link';
import { UrlObject } from 'url';
import Button from '../../../../components/common/Button';
import AppLink from '../../../../components/common/AppLink';
import RegularSelect from '../../../../components/common/RegularSelect';
import { useGetSelectedProjectQuery, useUpdateProjectInformationMutation } from '../../../../store/projects';
import Tooltip from '../../../../components/common/Tooltip';

type Props = {
  projectId: string;
};

const ProjectInformation = ({ projectId }: Props) => {
  const [copyText, setCopyText] = useState('Copy');
  const { data: project } = useGetSelectedProjectQuery(projectId);

  const copyIdToClipboardHandler = async () => {
    await window.navigator.clipboard.writeText(project.id);
    setCopyText('Copied!');
  };

  const [updateProject] = useUpdateProjectInformationMutation();
  const changeIsPrivateHandler = async (value: boolean) => {
    await updateProject({ formData: { is_private: value }, id: project.id });
  };

  return (
    <div className="lg:px-12 xl:flex-[1.1_1.1_0%] px-3 py-14 bg-white border-border-default border-[1px]">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-4xl lg:text-5xl lg:max-w-[50%] font-montserrat">{project?.name}</h3>
        <div>
          <VerticalDotsIcon className="fill-main-secondary cursor-pointer" />
        </div>
      </div>
      <div className="flex gap-8 flex-wrap justify-between mt-5 items-center">
        <div className="flex gap-8 items-center">
          <div className="text-content-secondary font-medium">
            Project ID -{' '}
            <div className="inline-block" onMouseLeave={() => setCopyText('Copy')}>
              <Tooltip text={copyText}>
                <AppLink color="primary" className="font-bold" onClick={copyIdToClipboardHandler}>
                  #{project?.id.slice(0, 8)}...
                </AppLink>
              </Tooltip>
            </div>
          </div>
          <Chip>
            <div className="rounded-full w-[10px] h-[10px] bg-content-tertiary"></div>
            <p>Not started</p>
          </Chip>
        </div>
        <RegularSelect
          options={IS_PRIVATE_VALUES}
          value={IS_PRIVATE_VALUES.find((item) => item.value === project?.is_private) || IS_PRIVATE_VALUES[0]}
          onSelectValue={changeIsPrivateHandler}
        />
      </div>
      {project?.description && (
        <div className="mt-10 border-b-border-default border-b-[1px]">
          <p className="text-content-secondary">Project description</p>
          <p className="text-sm px-8 py-5 font-medium">{project?.description}</p>
        </div>
      )}
      <div className="mt-[75px] flex gap-8 flex-col md:flex-row justify-between md:items-center border-b-border-default border-b-[1px] pb-[70px]">
        <div>
          <p className="text-content-secondary">Project address</p>
          <p className="font-bold">{project?.address}</p>
        </div>
        <div>
          <p className="text-content-secondary">Start date</p>
          <p className="font-bold">{project?.start_date}</p>
        </div>
        <div>
          <p className="text-content-secondary">Budget range</p>
          <p className="font-bold">
            ${Number(project?.min_budget).toLocaleString('en')} - ${Number(project?.max_budget).toLocaleString('en')}
          </p>
        </div>
      </div>
      <div className="mt-12 pb-[70px]">
        <p className="text-content-secondary">Project categories</p>
        <div className="flex flex-wrap mt-2 gap-2">
          {project?.categories?.map((item) => (
            <div className="font-bold text-[#004A96] px-7 py-3 bg-[#F2F4F8]" key={item.id}>
              {item.name}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-12 pb-[70px]">
        <div className="border-b-[1px] border-b-border-default">
          <p className="text-content-secondary">Attachments({project?.files.length})</p>
          <div className="flex flex-col mt-2 gap-4">
            {project?.files?.map((item) => (
              <div className="flex gap-2 items-center" key={item.id}>
                <div>
                  <DocumentIcon className="stroke-main-secondary" />
                </div>
                <p>
                  <Link target="_blank" href={item.fileUrl as unknown as UrlObject}>
                    <AppLink color="primary" className="font-bold">
                      {item.originalName.split('.')[0]}
                    </AppLink>
                  </Link>
                  .{item.originalName.split('.')[1]}({item.size / 1000}kb)
                </p>
              </div>
            ))}
          </div>
          {project?.floor_plan === 'own' && (
            <div className="mt-12 flex flex-col items-center">
              <p className="text-content-secondary">Floor plan</p>
              <div className="bg-background-subtleNeutral flex justify-center pt-[56px] mt-5 w-full">
                <div className="w-[240px] h-[72px] rounded-t-[6px] border-t-[28px] border-x-[28px] border-content-tertiary bg-white"></div>
              </div>
              <Button
                color="primary"
                className="border-0 hover:text-main-hover hover:outline-none active:text-main-active"
                outline={true}
              >
                View floor plan
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-10">
        <p className="text-main-secondary">Service provider tasks</p>
        <div className="flex flex-wrap mt-2 gap-2">
          {project?.tasks?.map((item, index) => (
            <div className="font-bold p-2 border-b-[1px] border-b-border-default w-full" key={item.id}>
              <div className="flex gap-6 items-center">
                <div className="py-1 px-3 bg-[#E0ECF8] w-8 flex justify-center">{index + 1}</div>
                <p>{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-14">
        <p className="text-main-secondary">Skill level</p>
        <p className="font-bold">{project?.skill_level}</p>
      </div>
      <div className="mt-12 pb-[70px]">
        <p className="text-main-secondary">Service provider skills</p>
        <div className="flex flex-wrap mt-2 gap-2">
          {project?.skills?.map((item) => (
            <div className="font-bold text-[#004A96] px-7 py-3 bg-[#F2F4F8]" key={item.id}>
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectInformation;
