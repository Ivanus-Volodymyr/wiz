'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import ChangePasswordForm from './ChangePasswordForm';
import { useDispatch } from '../../../../store';

export default function ChangePasswordPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmit = useCallback(
    async (data: { password: string }) => {
      try {
      } catch (e) {}
    },
    [dispatch, router]
  );

  return <ChangePasswordForm onSubmit={onSubmit} />;
}
