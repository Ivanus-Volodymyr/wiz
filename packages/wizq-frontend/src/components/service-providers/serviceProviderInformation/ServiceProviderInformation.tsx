import React from 'react';
import SPInfoHeader from './SPInfoHeader';
import SPInfoAbout from './SPInfoAbout';
import SPInfoProjects from './SPInfoProjects';
import SPInfoServices from './SPInfoServices';
import SPInfoCredentials from './SPInfoCredentials';
import SPInfoReviews from './SPInfoReviews';
import { useGetBusinessesQuery } from '../../../store/projects';
import ChevronLeftIcon from '../../../assets/icons/Icons=Chevron-Left.svg';
import { useRouter } from 'next/navigation';

type Props = {
  providerId: string;
};

const ServiceProviderInformation = ({ providerId }: Props) => {
  const { data: serviceBusiness } = useGetBusinessesQuery({ id: providerId });
  const router = useRouter();

  const goBackHandler = () => {
    router.back();
  };

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
      <div className="bg-white border-[1px] border-border-default">
        <SPInfoHeader business={serviceBusiness} />
        <div className="px-[58px]">
          <SPInfoAbout provider={serviceBusiness} />
          {serviceBusiness?.businessProjects && serviceBusiness?.businessProjects?.length > 0 && (
            <SPInfoProjects provider={serviceBusiness} />
          )}
          <SPInfoServices provider={serviceBusiness} />
          <SPInfoCredentials provider={serviceBusiness} />
          <SPInfoReviews provider={serviceBusiness} />
        </div>
      </div>
    </>
  );
};

export default ServiceProviderInformation;
