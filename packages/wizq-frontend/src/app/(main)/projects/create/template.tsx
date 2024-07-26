'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from '../../../../store';

const Template = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { createProjectStep: activeStep, selectedProject } = useSelector((state) => state.project);

  useEffect(() => {
    if (activeStep === 1) router.push('/projects/create/project-information');
    if (activeStep === 2) router.push('/projects/create/floor-plan');
    if (activeStep === 3) router.push('/projects/create/service');
    if (activeStep === 4) router.push('/projects/create/budget');
    if (activeStep === 5) router.push('/projects/create/review');
    if (activeStep === 6) router.push('/projects/create/saving');
    if (activeStep === 7) {
      if (selectedProject.floor_plan === 'designer') {
        return router.push('/projects/create/design-providers');
      } else {
        return router.push('/projects/create/service-providers');
      }
    }
  }, [activeStep, router, selectedProject.floor_plan]);

  return <>{children}</>;
};

export default Template;
