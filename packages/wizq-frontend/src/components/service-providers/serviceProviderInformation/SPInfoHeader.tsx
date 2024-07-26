'use client';

import React, { useState } from 'react';
import Avatar from '../../common/Avatar';
import Tooltip from '../../common/Tooltip';
import { SP_INFO_TABS } from '../../../utils/serviceProvider';
import { useRouter, usePathname } from 'next/navigation';
import { BusinessResponse } from '../../../types/business';
import { useGetUserDataQuery } from '../../../store/users';
import { useSelector } from '../../../store';
import ActionButtonsGroup from '../../project/ActionButtonsGroup';

import StarIcon from '../../../assets/icons/yellow-star.svg';
import VerifiedIcon from '../../../assets/icons/Icons=Badge.svg';
import LocationIcon from '../../../assets/icons/location.svg';

type Props = {
  business: BusinessResponse;
  projectId?: string;
};

const SpInfoHeader = ({ business, projectId }: Props) => {
  const { data: allProviders } = useGetUserDataQuery({});

  const selectedProvider = allProviders?.find((item) => item.id === business?.authorId);

  const selectedProject = useSelector((state) => state.project.selectedProject);
  const find = selectedProvider?.projectInvitation?.find((f) => f?.projectId === selectedProject?.id);

  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const changeActiveTabHandler = (tab: string) => {
    setActiveTab(tab);
    router.replace(`${pathname}/#${tab}`);
  };

  return (
    <div>
      <div className="w-full h-[30vh] bg-content-tertiary overflow-hidden"></div>
      <div className="px-12 pt-12 border-b-[1px] border-border-default">
        <div className="flex gap-8 flex-col lg:flex-row justify-between items-start">
          <div className="flex gap-5 items-start">
            <Avatar avatar="/assets/profile_empty.svg" isOnline={true} width={96} height={96} />
            <div>
              <div className="flex gap-5 mb-2">
                <h3 className="font-bold text-4xl font-montserrat mb-0">{business?.name}</h3>
              </div>
              <div className="flex gap-4">
                <div className="flex gap-2">
                  <VerifiedIcon className="fill-main-secondary" />
                  <p className="mb-0 text-base text-[#0D1835]">Verified License</p>
                </div>
                {business?.location && business?.location?.length > 0 && (
                  <div className="flex gap-2">
                    <div>
                      <LocationIcon />
                    </div>
                    <Tooltip text="Location">
                      <p>
                        {business?.location?.[0].city}, {business?.location?.[0].country}
                      </p>
                    </Tooltip>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 text-base mt-4">
                <div>
                  <StarIcon />
                </div>
                <span>•</span>
                <p className="mb-0">{`(4.5)`}</p>
                <p className="font-medium">164 reviews</p>
              </div>
            </div>
          </div>
          <ActionButtonsGroup
            providerId={selectedProvider?.id}
            invited={!!find}
            projectId={projectId}
            onMessage={() => undefined}
            onAddFavorites={() => undefined}
          />
        </div>
        <div className="mt-16">
          <ul className="flex flex-col sm:flex-row lg:gap-12">
            {SP_INFO_TABS.map((item) => (
              <li
                key={item.name}
                className={`p-2 cursor-pointer text-content-secondary ${
                  activeTab === item.link ? 'text-content-primary font-bold border-b-main-primary border-b-2' : ''
                }`}
                onClick={() => changeActiveTabHandler(item.link)}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SpInfoHeader;
