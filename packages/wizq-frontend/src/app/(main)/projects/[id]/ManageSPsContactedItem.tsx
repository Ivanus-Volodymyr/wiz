import React from 'react';
import Avatar from '../../../../components/common/Avatar';
import Button from '../../../../components/common/Button';
import ChevronRight from '../../../../assets/icons/Icons=Chevron-Right.svg';
import { usePathname, useRouter } from 'next/navigation';
import InviteButton from '../../../../components/project/InviteButton';
import { BusinessResponse } from '../../../../types/business';
import { useGetUserDataQuery } from '../../../../store/users';
import { fWeekDayDayYear } from '../../../../utils/formatTime';
import { useSelector } from '../../../../store';

type Props = {
  business: BusinessResponse;
};

const ManageSPsContactedItem = ({ business }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const selectedProject = useSelector((state) => state.project.selectedProject);

  const { data: allProviders } = useGetUserDataQuery({});
  const homeOwner = useSelector((state) => state.auth.user);

  const selectedProvider = allProviders?.find((item) => item.id === business?.authorId);
  const createdAtInvitation = selectedProvider?.projectInvitation?.find(
    (item) => item?.authorId === homeOwner?.id
  )?.createdAt;

  const find = selectedProvider?.projectInvitation?.find((f) => f?.projectId === selectedProject?.id);

  return (
    <li className="border-[1px] border-border-default p-5 bg-white">
      <div className="pb-4 border-b-border-default border-b-[1px] flex justify-between items-center sm:items-start flex-col sm:flex-row gap-4">
        <div className="flex gap-5 items-center sm:items-start flex-col sm:flex-row">
          <Avatar className="min-w-[64px]" avatar="/assets/profile_empty.svg" isOnline={true} />
          <div>
            <h5 className="text-xl font-bold font-montserrat">{business?.name}</h5>
            <p className="mt-2 text-sm">{business?.services?.[0]?.service?.name}</p>
          </div>
        </div>
        <Button
          onClick={() => router.push(`${pathname}/service-providers/${business.id}`)}
          color="primary"
          className="border-0 h-full hover:text-main-hover hover:outline-none active:text-main-active !px-0 min-w-[134px]"
          outline={true}
        >
          <p>View profile</p>
          <div>
            <ChevronRight className="fill-main-primary" />
          </div>
        </Button>
      </div>
      <div className="pt-4">
        <div className="flex justify-between gap-8 items-center flex-col sm:flex-row">
          <p className="font-medium text-[#788398]">
            Invitation sent on {createdAtInvitation && fWeekDayDayYear(createdAtInvitation)}
          </p>
          <InviteButton invited={!!find} providerId={selectedProvider?.id} />
        </div>
      </div>
    </li>
  );
};

export default ManageSPsContactedItem;
