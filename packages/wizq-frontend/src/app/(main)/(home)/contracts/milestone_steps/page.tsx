'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { contracts, useGetContractsQuery } from '../../../../../store/projects';
import { dispatch, useSelector } from '../../../../../store';
import { ContractsType } from '../../../../../types/contracts';

import { Steps } from '../../../../../container';
import { stepItems } from '../layout';
import MilestoneGeneral from './MilestoneGeneral';
import MilestonePayment from './MilestonePayment';
import MilestoneCompliance from './MilestoneCompliance';
import MilestoneReviewSign from './MilestoneReviewSign';
import SaveLoading from '../../../../../components/common/SaveLoading';

export default function MilestoneStepsPage() {
  const router = useRouter();
  const authInfo = useSelector((state) => state.auth.user);
  const { isLoading, refetch } = useGetContractsQuery({
    authId: authInfo?.id,
    contractType: ContractsType.milestone,
  });

  const [step, setStep] = useState<number>(-1);

  useEffect(() => {
    if (!isLoading) {
      dispatch(contracts.actions.initiallData());
      setStep(1);
    }
  }, [refetch, isLoading]);

  return (
    <div className="w-full py-20 px-2 sm:px-8 md:px-16 xl:pb-16 xl:px-52 flex flex-col bg-background-subtleNeutral">
      <h1 className="text-[40px] font-montserrat font-medium text-[#0D1835] mb-12">Create new milestone contract</h1>
      <Steps step={step} items={stepItems} setStep={setStep} view="contracts-milestone">
        {step === 1 && <MilestoneGeneral step={step.toString()} setStep={setStep} refetch={refetch} />}

        {step === 2 && <MilestonePayment step={step.toString()} setStep={setStep} refetch={refetch} />}

        {step === 3 && <MilestoneCompliance step={step.toString()} setStep={setStep} refetch={refetch} />}

        {step === 4 && <MilestoneReviewSign />}

        {step === 5 && (
          <SaveLoading
            onNextStep={() => router.replace('/contracts')}
            description="Saving your awesome contract..."
            className="w-[70%]"
          />
        )}
      </Steps>
    </div>
  );
}
