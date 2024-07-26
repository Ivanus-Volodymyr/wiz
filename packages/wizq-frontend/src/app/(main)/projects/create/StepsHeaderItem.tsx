import React from 'react';
import { Step } from '../../../../types/project';
import CheckIcon from '../../../../assets/icons/Icons=Check.svg';

type Props = {
  step: Step;
  isActive: boolean;
  passed: boolean;
};

const StepsHeaderItem = ({ step, isActive, passed }: Props) => {
  return (
    <div className="flex gap-5 items-center justify-center">
      {isActive ? (
        <>
          <div className="font-bold flex justify-center items-center p-2 rounded-full w-9 h-9 border-0 bg-main-primary text-label-white">
            {step.id}
          </div>
          <p className="font-bold text-main-secondary">{step.name}</p>
        </>
      ) : passed ? (
        <>
          <div className="font-bold flex justify-center items-center p-2 rounded-full w-9 h-9 border-0 bg-[#DAFAE7] text-label-white">
            <CheckIcon className="fill-state-success" />
          </div>
          <p className="font-bold text-main-secondary">{step.name}</p>
        </>
      ) : (
        <>
          <div className="font-bold flex justify-center items-center p-2 rounded-full w-9 h-9 text-main-secondary border-2 border-main-secondary">
            {step.id}
          </div>
          <p className="font-medium text-label-disable">{step.name}</p>
        </>
      )}
    </div>
  );
};

export default StepsHeaderItem;
