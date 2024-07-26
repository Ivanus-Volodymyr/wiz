'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { contracts, useGetContractsQuery } from '../../../../../store/projects';
import { dispatch, useSelector } from '../../../../../store';

import { Steps } from '../../../../../container';
import { stepItems } from '../layout';
import HourlyGeneral from './HourlyGeneral';
import HourlyPayment from './HourlyPayment';
import HourlyCompliance from './HourlyCompliance';
import HourlyReviewSign from './HourlyReviewSign';
import SaveLoading from '../../../../../components/common/SaveLoading';
import { ContractsType } from '../../../../../types/contracts';

export default function HourlyPage() {
  const router = useRouter();
  const authInfo = useSelector((state) => state.auth.user);
  const { isLoading, refetch } = useGetContractsQuery({ authId: authInfo?.id, contractType: ContractsType.hourly });

  const [step, setStep] = useState<number>(-1);

  useEffect(() => {
    if (!isLoading) {
      dispatch(contracts.actions.initiallData());
      setStep(1);
    }
  }, [refetch, isLoading]);

  return (
    <div className="w-full py-20 px-2 sm:px-8 md:px-16 xl:pb-16 xl:px-56 flex flex-col bg-background-subtleNeutral">
      <h1 className="text-[40px] font-montserrat font-medium text-[#0D1835] mb-12">Create new hourly contract</h1>
      <Steps step={step} items={stepItems} setStep={setStep} view="contracts-fixedrate">
        {step === 1 && <HourlyGeneral step={step.toString()} setStep={setStep} refetch={refetch} />}

        {step === 2 && <HourlyPayment step={step.toString()} setStep={setStep} refetch={refetch} />}

        {step === 3 && <HourlyCompliance step={step.toString()} setStep={setStep} refetch={refetch} />}

        {step === 4 && <HourlyReviewSign />}

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
