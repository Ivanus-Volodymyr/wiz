'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PersonOutline, CreditCardOutlined, WidthNormalOutlined } from '@mui/icons-material';
import Button from '../../../components/common/Button';
import { useSelector } from '../../../store';

import BgBlueImage from '../../../assets/images/bg-business-blue.svg';
import BgYellowImage from '../../../assets/images/bg-business-yellow.svg';

export default function BusinessPage() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const year = new Date().getFullYear();

  return (
    <>
      <BgBlueImage className="fixed bottom-0 left-0 z-[-1]" />
      <BgYellowImage className="fixed top-0 right-0 z-[-1]" />
      <div className="flex-1 flex flex-col items-center mt-[115px]">
        <h1 className={'text-5xl font-bold mb-[120px] text-center font-montserrat'}>
          Hello {user?.firstName}, Welcome to Wizquotes
        </h1>
        <div className="px-0 w-full xl:px-20 lg:px-10 mb-[60px]">
          <ul className="col-span-3 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1 sm:gap-y-10 md:grid-cols-3 xl:gap-x-8 w-full">
            <li className="bg-[#F6F6F6] w-full px-5 py-6">
              <PersonOutline className="w-[26px] h-[26px] text-[#017EFF] mb-[11px]" />
              <p className="text-lg font-bold">Set up your profile</p>
              <p className="text-base text-[#788398]">
                Lorem ipsum dolor sit amet consectetur. Magna velit tempor in massa nullam
              </p>
            </li>
            <li className="bg-[#F6F6F6] w-full px-5 py-6">
              <WidthNormalOutlined className="w-[26px] h-[26px] text-[#017EFF] mb-[11px]" />
              <p className="text-lg font-bold">Apply for roles available to you</p>
              <p className="text-base text-[#788398]">
                Lorem ipsum dolor sit amet consectetur. Magna velit tempor in massa nullam
              </p>
            </li>
            <li className="bg-[#F6F6F6] w-full px-5 py-6">
              <CreditCardOutlined className="w-[26px] h-[26px] text-[#017EFF] mb-[11px]" />
              <p className="text-lg font-bold">
                <span>Get paid</span>
                <Image
                  className="inline-block mt-[-32px]"
                  src="/assets/business/arrow_sun.png"
                  width={26}
                  height={29}
                  alt=""
                  aria-hidden
                />
              </p>
              <p className="text-base text-[#788398]">
                Lorem ipsum dolor sit amet consectetur. Magna velit tempor in massa nullam
              </p>
            </li>
          </ul>
        </div>
        <div className="px-5 py-[10px] rounded-[20px] bg-[#EEB93E1A] relative mb-20">
          <p className="text-base text-[#EEB93E]">
            Let’s get you set up for your next big opportunity to enhance living spaces
          </p>
          <Image
            className="inline-block absolute top-[-20px] right-[-30px]"
            src="/assets/business/vector.png"
            width={32}
            height={35}
            alt=""
            aria-hidden
          />
        </div>
        <p className="text-base mb-10">This will only take a few minutes</p>
        <Button
          block
          color="primary"
          className="!w-[250px] md:!w-[440px] mb-24"
          onClick={() => router.push('/business/steps')}
        >
          Get Started
        </Button>
        <p className="text-base text-[#788398]">© {year} Wizquotes</p>
      </div>
    </>
  );
}
