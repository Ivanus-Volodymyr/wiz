import React from 'react';
import { BusinessResponse } from '../../../types/business';
import { fMonthYear } from '../../../utils/formatTime';

type Props = {
  provider: BusinessResponse;
};
const SpInfoAbout = ({ provider }: Props) => {
  return (
    <div id="about-us" className="py-[100px]">
      <h3 className="text-4xl font-montserrat">About Us</h3>
      <p className="mt-9">{provider?.description}</p>
      <div className="flex-col gap-12 items-center lg:flex-row mt-[120px] flex lg:gap-[10%]">
        <div>
          <p className="text-content-secondary font-bold">Joined WizQuotes</p>
          <p className="text-2xl font-bold mt-4">{provider?.createdAt && fMonthYear(provider?.createdAt)}</p>
        </div>
        <div>
          <p className="text-content-secondary font-bold">Completed projects</p>
          <p className="text-2xl font-bold mt-4">{provider?.businessProjects?.length || 0}</p>
        </div>
        <div>
          <p className="text-content-secondary font-bold">License number</p>
          <p className="text-2xl font-bold mt-4">{provider?.license || 'Not licensed'}</p>
        </div>
        <div>
          <p className="text-content-secondary font-bold">Experience</p>
          <p className="text-2xl font-bold mt-4">1 year</p>
        </div>
      </div>
    </div>
  );
};

export default SpInfoAbout;
