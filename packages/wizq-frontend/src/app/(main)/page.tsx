'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from '../../store';
import LoadingScreen from '../../components/common/LoadingScreen';
import { isValidToken } from '../../lib/auth/jwt';
import { errorToast } from '../../lib/toast';
import { logout } from '../../store/projects';

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.userType) {
      if (user?.email_verified && isValidToken(accessToken)) {
        router.replace('/overview');
      } else {
        if (!window.localStorage.getItem('routeInfo')) {
          errorToast('Email verification failed.');
          setTimeout(() => {
            dispatch(logout());
          }, 3500);
        } else {
          window.localStorage.removeItem('routeInfo');
          dispatch(logout());
        }
      }
    } else {
      errorToast('Address already exists.');
      setTimeout(() => {
        dispatch(logout());
      }, 3500);
    }
  }, [accessToken, router, user]);

  return <LoadingScreen full />;
};

export default Page;
