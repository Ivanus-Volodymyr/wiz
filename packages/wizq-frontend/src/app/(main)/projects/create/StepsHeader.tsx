import React from 'react';
import StepsHeaderItem from './StepsHeaderItem';
import { CREATE_PROJECT_STEPS } from '../../../../utils/createProject';

type Props = {
  activeStep: number;
};

const StepsHeader = ({ activeStep }: Props) => {
  const nextStep = () => CREATE_PROJECT_STEPS.find((item) => item.id === activeStep + 1);

  return (
    <>
      <div className="py-10 px-10 items-center justify-center gap-16 border-b-2 border-b-fill-border flex-wrap hidden lg:flex">
        {CREATE_PROJECT_STEPS.map((step) => (
          <StepsHeaderItem key={step.id} passed={step.id < activeStep} isActive={activeStep === step.id} step={step} />
        ))}
      </div>
      <div className="flex justify-between items-center py-10 px-10 border-b-2 border-b-fill-border gap-4 lg:hidden">
        <StepsHeaderItem
          passed={false}
          isActive={true}
          step={CREATE_PROJECT_STEPS.find((item) => item.id === activeStep)}
        />
        {nextStep()?.name && (
          <p className="text-right text-content-secondary font-bold text-[12px]">Next: {nextStep()?.name}</p>
        )}
      </div>
    </>
  );
};

export default StepsHeader;
