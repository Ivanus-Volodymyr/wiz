import React from 'react';
import Image from 'next/image';
import LocationIcon from '../../../assets/icons/Icons=location, Property 1=Variant55.svg';
import Tooltip from '../../common/Tooltip';

import ChevronUpRight from '../../../assets/icons/chevron-up-right.svg';
import { BusinessProjectType } from '../../../types/business';
import { FileType } from '../../../types';

type Props = {
  project: BusinessProjectType;
};

const SpProjectItem = ({ project }: Props) => {
  return (
    <div className="border-[1px] border-border-default">
      <div className="h-[385px] overflow-hidden">
        <Image
          width={500}
          height={385}
          src={
            project.files && project.files.length > 0
              ? (project.files[0] as FileType).fileUrl.includes('.jpg' || '.png' || '.svg')
                ? (project.files[0] as FileType).fileUrl
                : (project.files[0] as FileType).fileUrl
              : '/assets/profile_empty.svg'
          }
          alt="project"
        />
      </div>
      <div className="p-4 cursor-pointer">
        <p className="font-bold">{project?.name}</p>
        <div className="flex justify-between mt-5 items-center">
          <div className="flex gap-2 items-center">
            <div>
              <LocationIcon className="stroke-main-secondary" />
            </div>
            <Tooltip text="Location">
              <p>{project?.location}</p>
            </Tooltip>
          </div>
          <div>
            <ChevronUpRight className="stroke-main-secondary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpProjectItem;
