import React, { useEffect, useState } from 'react';
import { useGetUserDataQuery } from '../../store/users';
import { UserType1 } from '../../types';
import { UserData } from '../../types/user';
import ServiceProviderListItem from './ServiceProviderListItem';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from '../../store';
import ChevronLeftIcon from '../../assets/icons/Icons=Chevron-Left.svg';

const ServiceProviderList = () => {
  const searchParams = useSearchParams();
  const filterType = searchParams.get('filterType');
  const project = useSelector((state) => state.project.selectedProject);
  const { data: users } = useGetUserDataQuery({ type: UserType1.SERVICE_PROVIDER });

  const [userData, setUserData] = useState<UserData[]>([]);

  const router = useRouter();

  const goBackHandler = () => {
    router.back();
  };

  useEffect(() => {
    let filter = users?.filter((rs: UserData) => rs.subType === 'PROVIDER');

    if (filterType === 'matched' && filter) {
      filter = filter.filter((item) =>
        project?.matched?.map((matched) => matched?.Business?.[0]?.id).includes(item?.Business?.[0]?.id)
      );
    }
    setUserData(filter);
  }, [filterType, project, project?.matched, users]);

  return (
    <>
      <div className="pl-3 py-4">
        <button className="flex gap-4" onClick={goBackHandler}>
          <div>
            <ChevronLeftIcon className="fill-main-secondary" />
          </div>
          <span className="font-medium">Back</span>
        </button>
      </div>
      <div className="grid lg:grid-cols-3 grid-rows-2 lg:grid-rows-none lg:gap-x-14 gap-y-14">
        <div className="lg:col-span-2">
          <div className="px-7">
            <p className="text-xl lg:text-[40px] font-medium font-montserrat mb-6">Connect with a service provider</p>
            {filterType === 'matched' && (
              <p className="text-base text-[#0D1835]">
                We’ve put together a list of service providers that match your project
              </p>
            )}
          </div>
          <ul className="mt-9">
            {userData?.map((item: UserData, key: number) => (
              <ServiceProviderListItem key={key} data={item} />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ServiceProviderList;
