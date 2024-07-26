'use client';

import React, { useCallback } from 'react';

import LoginForm from './LoginForm';
import { loginWithPassword } from '../../../store/projects';
import { useDispatch } from '../../../store';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmit = useCallback(
    async (data: { email: string; password: string }) => {
      try {
        await dispatch(loginWithPassword({ ...data }));
        router.push('/');
      } catch (e) {}
    },
    [dispatch, router]
  );

  return <LoginForm onSubmit={onSubmit} />;
};

export default LoginPage;
