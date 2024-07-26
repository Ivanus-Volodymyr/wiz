'use client';

import React from 'react';
import { useSelector } from '../../../../store';
import HomeOwnerInfo from './HomeOwnerInfo';
import ServiceProviderInfo from './ServiceProviderInfo';
import { UserType1 } from '../../../../types';

const OverviewPage = () => {
  const { userType } = useSelector((state) => state.auth.user);

  return (
    <div className="p-5 lg:p-16">
      <div className="flex gap-5 justify-between flex-col lg:flex-row">
        {userType === UserType1.HOME_OWNER && <HomeOwnerInfo />}
        {userType === UserType1.SERVICE_PROVIDER && <ServiceProviderInfo />}
      </div>
    </div>
  );
};

export default OverviewPage;
