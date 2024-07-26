'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { checkAuth } from '../../store/projects';
import { useDispatch } from '../../store';
import LoadingScreen from '../../components/common/LoadingScreen';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await dispatch(checkAuth());
      setIsLoading(false);
    })();
  }, [dispatch]);

  if (isLoading) return <LoadingScreen full />;

  const handleLogo = () => {
    if (pathname === '/email') {
      window.localStorage.setItem('routeInfo', 'email');
    }

    window.location.replace('/');
  };

  return (
    <div className="min-h-full flex">
      <div className="w-full lg:w-1/2 flex min-h-full p-8 md:px-8 lg:px-16 xl:py-16 xl:px-32 flex-col">
        <div className="cursor-pointer mb-24 w-[255px]" onClick={handleLogo}>
          <Image src="/assets/logo.svg" alt="WizQuotes" width="255" height="48" className="w-[190px] xl:w-[255px]" />
        </div>
        <div className="flex-1 flex flex-col justify-center">{children}</div>
      </div>
      <div className="lg:flex hidden w-1/2 flex-1">
        <Image
          className="w-1/2 fixed h-full object-cover"
          alt=""
          src="/assets/auth/service-provider-bg.png"
          width={0}
          height={0}
          sizes="100vh"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
