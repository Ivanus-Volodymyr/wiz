import React from 'react';
import Avatar from '../../../../components/common/Avatar';
import Button from '../../../../components/common/Button';
import ChevronRight from '../../../../assets/icons/Icons=Chevron-Right.svg';
import { usePathname, useRouter } from 'next/navigation';
import InviteButton from '../../../../components/project/InviteButton';
import DollarIcon from '../../../../assets/icons/Icons=wage, Property 1=Variant55.svg';
import Tooltip from '../../../../components/common/Tooltip';
import LocationIcon from '../../../../assets/icons/Icons=location, Property 1=Variant55.svg';
import MiniLogo from '../../../../assets/icons/miniLogo.svg';
import { BusinessResponse } from '../../../../types/business';
import { useGetUserDataQuery } from '../../../../store/users';
import { useSelector } from '../../../../store';

type Props = {
  business: BusinessResponse;
};

const ManageSPsMatchedItem = ({ business }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: allProviders } = useGetUserDataQuery({});

  const selectedProvider = allProviders?.find((item) => item.id === business?.authorId);
  const selectedProject = useSelector((state) => state.project.selectedProject);
  const find = selectedProvider?.projectInvitation?.find((f) => f?.projectId === selectedProject?.id);

  return (
    <li className="border-[1px] border-border-default p-5 bg-white">
      <div className="pb-4 border-b-border-default border-b-[1px] flex justify-between sm:items-start flex-col sm:flex-row items-center gap-4">
        <div className="flex gap-5 items-center sm:items-start flex-col sm:flex-row">
          <Avatar avatar="/assets/profile_empty.svg" isOnline={true} />
          <div>
            <h5 className="text-xl font-bold font-montserrat">{business?.name}</h5>
            <p className="mt-2 text-sm">{business?.services?.[0]?.service?.name}</p>
            <div className="flex items-center gap-5 flex-col sm:flex-row mt-3">
              <div>
                <DollarIcon />
              </div>
              <Tooltip text="Price">
                <p>
                  <span className="font-bold">
                    ${business?.hourly_rate ? parseFloat(business?.hourly_rate?.toString()).toFixed(2) : 0.0}
                  </span>
                  /hr
                </p>
              </Tooltip>
              {business?.location && business?.location.length > 0 && (
                <div className="flex gap-2 items-center">
                  <div>
                    <LocationIcon className="stroke-main-secondary" />
                  </div>
                  <Tooltip text="Location">
                    <p>
                      {business?.location?.[0].city}, {business?.location?.[0].country}
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
                    $500+
                    {/*${parseFloat(provider?.earned).toLocaleString()} {parseFloat(provider?.earned) > 0 ? '+' : ''}*/}
                  </p>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
        <Button
          onClick={() => router.push(`${pathname}/service-providers/${business.id}`)}
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
      <div className="pt-4">
        <div className="flex items-center justify-end gap-8 flex-col sm:flex-row">
          <Button color="secondary" className="rounded-[3px] !h-[50px] w-[226px]">
            Message
          </Button>
          <InviteButton invited={!!find} providerId={selectedProvider?.id} />
        </div>
      </div>
    </li>
  );
};

export default ManageSPsMatchedItem;
