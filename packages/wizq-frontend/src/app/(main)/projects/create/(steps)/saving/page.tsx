'use client';

import React from 'react';
import SaveLoading from '../../../../../../components/common/SaveLoading';
import useCreateProject from '../../../../../../hooks/useCreateProject';

const SaveProjectPage = () => {
  const { goNextStep } = useCreateProject();

  return <SaveLoading onNextStep={goNextStep} description="Saving your awesome project..." />;
};

export default SaveProjectPage;
