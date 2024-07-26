import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { add } from 'date-fns';
import { errorToast } from '../lib/toast';
import Button from '../components/common/Button';

import { useSelector } from '../store';

import CheckIcon from '../assets/icons/Icons=Check.svg';

interface StepsProps {
  children: ReactNode;
  step: number;
  items: { title: string }[];
  setStep: React.Dispatch<React.SetStateAction<number>>;
  view: string;
  checked?: boolean;
  setError?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Steps({ children, step, items, setStep, view, checked, setError }: StepsProps) {
  const router = useRouter();
  const { contracts } = useSelector((state) => state.contracts);

  const stepItem = (index: number, title: string) => {
    return (
      <div className="flex items-center gap-5" key={index}>
        <div
          className={`w-[37px] h-[37px] rounded-full flex items-center justify-center ${
            step === index ? 'bg-[#017EFF]' : step > index ? 'bg-[#DAFAE7]' : 'border-2 border-[#0D1835]'
          }`}
        >
          {step > index ? (
            <CheckIcon className="fill-state-success" />
          ) : (
            <span className={`text-base font-bold ${step === index ? 'text-white' : 'text-[#0D1835]'}`}>{index}</span>
          )}
        </div>
        <p className="text-base text-[#0D1835] font-bold mb-0">{title}</p>
      </div>
    );
  };

  const handlerBack = () => {
    if (step <= 1) {
      if (view === 'business') {
        router.push('/business');
      }

      if (view.search('contracts') !== -1) {
        router.push('/contracts/new_contract');
      }
    } else {
      setStep((preStep) => preStep - 1);
    }
  };

  return (
    <div className="w-full h-full border border-[#CDD6EC] flex flex-col items-center bg-white">
      <div className="w-full px-9 py-9 border-b border-[#CDD6EC] flex items-center justify-center gap-16 flex-wrap">
        {items.map((rs: { title: string }, key: number) => stepItem(key + 1, rs.title))}
      </div>
      <div className="h-full py-[107px] w-full flex flex-col items-center justify-center">
        <div className="mb-24 w-full flex flex-col items-center justify-center">{children}</div>
        <div className="flex items-center justify-between flex-col md:flex-row gap-5 w-full lg:w-[705px] px-7">
          {view.search('contracts') !== -1 && step <= 4 ? (
            <Button className="w-full md:w-[30%]" color="secondary" onClick={handlerBack}>
              Back
            </Button>
          ) : view.search('contracts') === -1 ? (
            <Button className="w-full md:w-[30%]" color="secondary" onClick={handlerBack}>
              Back
            </Button>
          ) : (
            <></>
          )}

          {view === 'business' && (
            <>
              {step === 6 ? (
                <Button
                  className="w-full md:w-[60%]"
                  color="primary"
                  onClick={() => {
                    if (checked) {
                      router.replace('/');
                    } else {
                      setError(true);
                    }
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button className="w-full md:w-[60%]" form={step.toString()} type="submit" color="primary">
                  Next
                </Button>
              )}
            </>
          )}

          {view.search('contracts') !== -1 && step <= 4 && (
            <>
              {step === 4 ? (
                <Button
                  className="w-full md:w-[60%]"
                  color="primary"
                  onClick={() => {
                    if (contracts && contracts?.[0]?.start_date) {
                      if (add(new Date(contracts?.[0]?.start_date), { days: 1 }) < new Date()) {
                        errorToast(
                          'The start date of contracts must be same to today or more than today.\n Please check again'
                        );
                        return;
                      }
                    }

                    setStep((preStep) => preStep + 1);
                  }}
                >
                  Save & Continue
                </Button>
              ) : (
                <Button className="w-full md:w-[60%]" form={step.toString()} type="submit" color="primary">
                  Save & Continue
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
