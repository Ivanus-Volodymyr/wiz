'use client';

import React from 'react';
import { useSelector } from '../../../../../store';
import { useGetSelectedProjectQuery } from '../../../../../store/projects';
import StepsHeader from '../StepsHeader';
import Button from '../../../../../components/common/Button';
import classNames from 'classnames';
import ArrowRightIcon from '../../../../../assets/icons/Icons=Chevron-Right.svg';
import useCreateProject from '../../../../../hooks/useCreateProject';

export default function CreateProjectStepsLayout({ children }: { children: React.ReactNode }) {
  const { selectedProject, createProjectStep: activeStep } = useSelector((state) => state.project);
  useGetSelectedProjectQuery(selectedProject.id, { skip: !selectedProject.id });

  const { goBackStep } = useCreateProject();

  return (
    <>
      <p className="pl-7 md:p-0 text-[30px] lg:text-5xl font-medium">Create new project</p>
      <div className="mt-5 pb-20 bg-label-white border-x-0 border-2 md:border-x-2 border-fill-border">
        {activeStep < 6 && <StepsHeader activeStep={activeStep} />}
        <div className="px-[5%] lg:px-[24%] py-[10%] text-main-secondary">{children}</div>
        {activeStep < 6 && (
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 px-5">
            <Button
              color="secondary"
              onClick={goBackStep}
              className={classNames({
                'w-[100%] lg:w-[232px] lg:h-[50px]': true,
              })}
            >
              Back
            </Button>
            <Button
              form={activeStep.toString()}
              type="submit"
              color="primary"
              className={classNames({
                'w-[100%] lg:w-[317px] lg:h-[50px]': true,
              })}
            >
              Save & Continue
              <div>
                <ArrowRightIcon className="fill-accent-white" />
              </div>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
