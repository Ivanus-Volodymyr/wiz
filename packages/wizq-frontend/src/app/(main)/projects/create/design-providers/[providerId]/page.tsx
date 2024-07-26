'use client';

import React from 'react';
import ServiceProviderInformation from '../../../../../../components/service-providers/serviceProviderInformation/ServiceProviderInformation';

const SingleServiceProviderPage = ({ params }: { params: { providerId: string } }) => {
  return <ServiceProviderInformation providerId={params.providerId} />;
};

export default SingleServiceProviderPage;
