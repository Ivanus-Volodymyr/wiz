import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '../../../../components/common/Button';
import Tooltip from '../../../../components/common/Tooltip';
import Avatar from '../../../../components/common/Avatar';
import { useSelector } from '../../../../store';
import { UserData } from '../../../../types/user';

import MessageIcon from '../../../../assets/icons/Icons=Envelope.svg';
import ChevronRight from '../../../../assets/icons/Icons=Chevron-Right.svg';
import DollarIcon from '../../../../assets/icons/Icons=wage, Property 1=Variant55.svg';
import LocationIcon from '../../../../assets/icons/Icons=location, Property 1=Variant55.svg';
import MiniLogo from '../../../../assets/icons/miniLogo.svg';
import InviteButton from '../../../../components/project/InviteButton';

type Props = {
  data: UserData;
  refetch: any;
};

const DesignerListItem = ({ data }: Props) => {
  const pathname = usePathname();

  const selectedProject = useSelector((state) => state.project.selectedProject);
  const find = data?.projectInvitation?.find((f) => f.providerId === data?.id && f?.projectId === selectedProject?.id);

  return (
    <li className="bg-label-white px-7 border-[#CDD6EC] mt-6 border-t-[1px] first:mt-0 first:border-0">
      <div className="flex justify-between py-5 border-b-[1px] border-[#CDD6EC] flex-col lg:flex-row gap-5">
        <div className="flex gap-5">
          <Avatar avatar={data?.picture} isOnline={true} />
          <div>
            <p className="font-bold text-xl">
              {data?.firstName} {data?.lastName}
            </p>
            <p className="mt-2">{data?.Business?.[0]?.services?.[0]?.service?.name}</p>
          </div>
        </div>
        <Link href={`${pathname}/service-providers/${data?.Business?.[0].id || ''}`} className="flex font-bold text-[#017EFF]">
          <span className="text-base mr-4">View profile</span> <ChevronRight className="fill-main-primary" />
        </Link>
      </div>
      <div className="flex justify-between py-5 items-center flex-col lg:flex-row gap-5">
        <div className="flex items-center gap-5 flex-col lg:flex-row">
          <div>
            <DollarIcon />
          </div>
          <Tooltip text="Price">
            <p>
              <span className="font-bold">
                $
                {data?.Business?.[0]?.hourly_rate
                  ? parseFloat(data?.Business?.[0]?.hourly_rate?.toString()).toFixed(2)
                  : 0.0}
              </span>
              /hr
            </p>
          </Tooltip>
          {data?.Business?.[0]?.location[0] && (
            <div className="flex gap-2 items-center">
              <div>
                <LocationIcon />
              </div>
              <Tooltip text="Location">
                <p>
                  {data?.Business?.[0]?.location?.[0]?.city}, {data?.Business?.[0]?.location?.[0]?.country}
                </p>
              </Tooltip>
            </div>
          )}
          <div className="flex gap-2 items-center">
            <div>
              <MiniLogo />
            </div>
            <Tooltip text="All time earned">
              <p className="font-bold">
                ${parseFloat(data?.earned).toLocaleString()} {parseFloat(data?.earned) > 0 ? '+' : ''}
              </p>
            </Tooltip>
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
          <Button color={'secondary'} className="border-0 hover:border-0 rounded !h-[50px]">
            Message
            <MessageIcon className="stroke-accent-white stroke-2" />
          </Button>
          <InviteButton invited={!!find} providerId={data?.id} />
        </div>
      </div>
    </li>
  );
};

export default DesignerListItem;
