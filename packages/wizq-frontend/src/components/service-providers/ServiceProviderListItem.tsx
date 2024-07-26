import React from 'react';
import Button from '../common/Button';
import Tooltip from '../common/Tooltip';
import Avatar from '../common/Avatar';
import { UserData } from '../../types/user';

import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from '../../store';
import ActionButtonsGroup from '../project/ActionButtonsGroup';

import VerifiedIcon from '../../assets/icons/Icons=Badge.svg';
import StarIcon from '../../assets/icons/yellow-star.svg';
import ChevronRight from '../../assets/icons/Icons=Chevron-Right.svg';
import LocationIcon from '../../assets/icons/location.svg';

type Props = {
  data: UserData;
};

const ServiceProviderListItem = ({ data }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const selectedProject = useSelector((state) => state.project.selectedProject);
  const find = data?.projectInvitation?.find((f) => f?.projectId === selectedProject?.id);

  return (
    <li className="bg-label-white px-7 border-[#CDD6EC] mt-6 border-t-[1px] first:mt-0 first:border-0">
      <div className="flex justify-between py-5 border-b-[1px] border-[#CDD6EC] flex-col lg:flex-row gap-5">
        <div className="flex gap-5">
          <Avatar avatar="/assets/profile_empty.svg" isOnline={true} width={96} height={96} />
          <div>
            <div className="flex flex-col sm:flex-row gap-5 mb-2">
              <p className="font-bold text-xl font-montserrat mb-0">{data?.Business?.[0]?.name}</p>
              <div className="flex items-center gap-1 text-base text-[#788398]">
                <div>
                  <StarIcon />
                </div>
                <span>•</span>
                <p className="mb-0">{`(4.5)`}</p>
              </div>
            </div>
            <p className="mb-2 text-base text-[#0D1835]">{data?.Business?.[0]?.services?.[0]?.service?.name}</p>
            <div className="flex gap-2">
              <VerifiedIcon className="fill-main-secondary" />
              <p className="mb-0 text-base text-[#0D1835]">Verified License</p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => router.push(`${pathname}/${data?.Business?.[0].id || ''}`)}
          color="primary"
          className="border-0 h-full hover:text-main-hover hover:outline-none active:text-main-active"
          outline={true}
        >
          <p>View profile</p>
          <div>
            <ChevronRight className="fill-main-primary" />
          </div>
        </Button>
      </div>
      <div className="flex lg:justify-between py-5 items-center flex-col xl:flex-row gap-5">
        <div>
          {data?.Business?.[0]?.location?.[0]?.city && data?.Business?.[0]?.location?.[0]?.country && (
            <div className="flex gap-2">
              <div>
                <LocationIcon className="stroke-main-secondary" />
              </div>
              <Tooltip text="Location">
                <p>
                  {data?.Business?.[0]?.location?.[0]?.city}, {data?.Business?.[0]?.location?.[0]?.country}
                </p>
              </Tooltip>
            </div>
          )}
        </div>
        <ActionButtonsGroup
          providerId={data.id}
          invited={!!find}
          onMessage={() => undefined}
          onAddFavorites={() => undefined}
        />
      </div>
    </li>
  );
};

export default ServiceProviderListItem;
