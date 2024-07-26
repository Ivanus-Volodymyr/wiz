import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import classNames from 'classnames';
import { UserType, UserType1 } from '../../types';

import IconClose from '../../assets/icons/Icons=Times.svg';

interface Props {
  isOpen: boolean;
  onChange: (value: UserType) => void;
}

export default function UserTypeModal({ isOpen, onChange }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }, [isOpen]);

  return (
    <div
      className={classNames({
        'fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center transition-all duration-500 z-[1]': true,
        'opacity-0 pointer-events-none': !isOpen,
        'font-montserrat': true,
      })}
    >
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-main-secondary"></div>
      <div className="bg-white relative pt-6 pb-36 max-w-full max-h-full mx-6 min-w-1/3 w-[831px] z-10 text-center overflow-auto">
        <div className="flex justify-end pr-5 mb-8 cursor-pointer" onClick={() => router.replace('/login')}>
          <IconClose className="fill-main-secondary" />
        </div>
        <h2 className="text-3xl mb-24">How would you like to proceed?</h2>
        <div
          className="w-72 mx-6 my-3 border border-fill-border inline-block cursor-pointer"
          onClick={() => onChange(UserType1.HOME_OWNER)}
        >
          <Image src="/assets/auth/home-owner-stock-photo.jpg" alt="Home owner" width="291" height="260" />
          <div className="leading-[87px] text-2xl font-bold">Home owner</div>
        </div>
        <div
          className="w-72 mx-6 my-3 border border-fill-border inline-block cursor-pointer"
          onClick={() => onChange(UserType1.SERVICE_PROVIDER)}
        >
          <Image src="/assets/auth/service-provider-stock-photo.jpg" alt="Service provider" width="291" height="260" />
          <div className="leading-[87px] text-2xl font-bold">Service provider</div>
        </div>
      </div>
    </div>
  );
}
