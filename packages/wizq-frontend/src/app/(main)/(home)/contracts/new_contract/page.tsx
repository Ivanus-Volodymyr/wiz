'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useSelector } from '../../../../../store';
import { useDeleteIncompleteContractsMutation } from '../../../../../store/projects';

import MilestoneIcon from '../../../../../assets/icons/Icons=Milestones.svg';
import FixedRateIcon from '../../../../../assets/icons/Icons=FixedRate.svg';
import HourlyIcon from '../../../../../assets/icons/Icons=Calendar_1.svg';
import InfoIcon from '../../../../../assets/icons/Icons=Info-Cirlce.svg';

export default function NewContractPage() {
  const router = useRouter();
  const authInfo = useSelector((state) => state.auth.user);
  const [deleteIncompleteContract] = useDeleteIncompleteContractsMutation();

  const [selected, setSelected] = useState<string>('');

  useEffect(() => {
    void deleteIncompleteContract({ authId: authInfo?.id });
  }, [authInfo, router]);

  const handleClick = (value: string) => {
    setSelected(value);
    router.push(`/contracts/${value}_steps`);
  };

  return (
    <div className="w-full py-20 px-8 md:px-16 xl:pb-16 xl:px-52 flex flex-col">
      <h1 className="text-[40px] font-montserrat font-medium text-[#0D1835] mb-12">Create new contract</h1>
      <div className="border border-[#CDD6EC] w-full flex flex-col items-center justify-center py-11 lg:py-36 bg-white">
        <h3 className="text-[18px] font-medium text-[#0D1835] mb-16 px-5">What type of contract do you need?</h3>
        <div className="px-5 w-full xl:px-9 mb-[60px]">
          <ul className="flex flex-col gap-3 w-full xl:flex-row">
            <li
              className={`w-full border-2 border-[#CDD6EC] p-5 hover:border-[#017EFF] hover:bg-[#CCE5FF] cursor-pointer rounded-1 ${
                selected === 'milestone' ? 'bg-[#CCE5FF] border-[#017EFF]' : ''
              }`}
              onClick={() => handleClick('milestone')}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center">
                  <MilestoneIcon />
                  <p className="mb-0 text-base text-[#0D1835] font-bold ml-4">Milestones</p>
                </div>
                <InfoIcon className="fill-main-primary" />
              </div>
              <p className="text-base leading-5">
                Designed for contracts that disburse payments per milestone completed
              </p>
            </li>
            <li
              className={`w-full border-2 border-[#CDD6EC] p-5 hover:border-[#017EFF] hover:bg-[#CCE5FF] cursor-pointer rounded-1 ${
                selected === 'fixedrate' ? 'bg-[#CCE5FF] border-[#017EFF]' : ''
              }`}
              onClick={() => handleClick('fixedrate')}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center">
                  <FixedRateIcon />
                  <p className="mb-0 text-base text-[#0D1835] font-bold ml-4">Fixed rate</p>
                </div>
                <InfoIcon className="fill-main-primary" />
              </div>
              <p className="text-base leading-5">Designed for contracts with a fixed rate for each payment</p>
            </li>
            <li
              className={`w-full border-2 border-[#CDD6EC] p-5 hover:border-[#017EFF] hover:bg-[#CCE5FF] cursor-pointer rounded-1 ${
                selected === 'hourly' ? 'bg-[#CCE5FF] border-[#017EFF]' : ''
              }`}
              onClick={() => handleClick('hourly')}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center">
                  <HourlyIcon />
                  <p className="mb-0 text-base text-[#0D1835] font-bold ml-4">Hourly</p>
                </div>
                <InfoIcon className="fill-main-primary" />
              </div>
              <p className="text-base leading-5">
                Designed for contracts that require time sheets or work submissions before payment.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
