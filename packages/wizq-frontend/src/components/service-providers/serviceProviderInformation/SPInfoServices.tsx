import React from 'react';
import { BusinessResponse } from '../../../types/business';

type Props = {
  provider: BusinessResponse;
};
const SpInfoServices = ({ provider }: Props) => {
  return (
    <div id="services" className="py-14">
      <h3 className="text-main-secondary font-montserrat text-4xl">Services</h3>
      <div className="flex flex-wrap mt-[42px] gap-5 lg:max-w-[70%]">
        {provider?.services &&
          provider?.services.length > 0 &&
          provider.services.map((item) => (
            <div className="px-6 py-4 bg-[#F2F4F8]" key={item.service.name}>
              {item.service.name}
            </div>
          ))}
      </div>
    </div>
  );
};

export default SpInfoServices;
