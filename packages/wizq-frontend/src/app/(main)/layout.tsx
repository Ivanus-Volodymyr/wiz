'use client';

import React, { useEffect, type ReactNode, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { useDispatch, useSelector } from '../../store';
import { checkAuth, useFinishSignupMutation } from '../../store/projects';

import LoadingScreen from '../../components/common/LoadingScreen';
import UserTypeModal from '../../components/auth/UserTypeModal';
import { Header } from '../../container';
import AppSnackbar from '../../components/snackbar/AppSnackbar';

const MainTemplate = ({ children }: { children: ReactNode }) => {
  const query = useSearchParams();
  const auth = query.get('auth');

  const { isUserTypeModalOpen, user } = useSelector((state) => state.auth);
  const [finishSignup] = useFinishSignupMutation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const visible = !isUserTypeModalOpen && !!user;

  useEffect(() => {
    (async () => {
      setLoading(true);
      await dispatch(checkAuth(auth));
      setLoading(false);
    })();
  }, [dispatch]);

  if (!user || loading) return <LoadingScreen full />;

  return (
    <>
      <Header visible={visible} />
      <div className="pt-[137px] h-full">
        <AppSnackbar />
        {children}
      </div>
      <UserTypeModal
        isOpen={isUserTypeModalOpen}
        onChange={(userType) => {
          void finishSignup(userType);
        }}
      />
    </>
  );
};

export default MainTemplate;
