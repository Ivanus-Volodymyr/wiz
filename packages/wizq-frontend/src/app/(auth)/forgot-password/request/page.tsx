'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import RequestLinkPasswordForm from './RequestLinkPasswordForm';
import { useDispatch } from '../../../../store';
import { requestLinkChangePassword } from '../../../../store/projects';
import { succesToast } from '../../../../lib/toast';

export default function RequestLinkPasswordPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = useCallback(
    async (data: { email: string }) => {
      try {
        setLoading(true);
        const resp = await requestLinkChangePassword(data?.email);

        if (resp && resp?.status === 200) {
          succesToast(resp?.data);

          setTimeout(() => {
            setLoading(false);
            router.replace('/login');
          }, 5000);
        }
      } catch (e) {
        console.log(e);
      }
    },
    [dispatch, router]
  );

  return <RequestLinkPasswordForm loading={loading} onSubmit={onSubmit} />;
}
