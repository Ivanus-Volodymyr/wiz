'use client';

import React from 'react';
import ServiceProviderInformation from '../../../../components/service-providers/serviceProviderInformation/ServiceProviderInformation';

const SingleServiceProviderPage = ({ params }: { params: { id: string } }) => {
  return <ServiceProviderInformation providerId={params.id} />;
};

export default SingleServiceProviderPage;
