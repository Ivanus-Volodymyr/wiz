'use client';
import React, { useCallback, useState } from 'react';
import NewAccountForm from './NewAccountForm';
import { User, UserType } from '../../../types';
import { signupWithPassword, useGetBusinessesQuery } from '../../../store/projects';
import UserTypeModal from '../../../components/auth/UserTypeModal';
import { useDispatch } from '../../../store';

const SignupPage = () => {
  const dispatch = useDispatch();
  useGetBusinessesQuery({});

  const [userType, setUserType] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSignup = useCallback(
    async (data: User & { password: string }) => {
      if (!userType) return;

      if (typeof window !== 'undefined') {
        if (data.businessName) localStorage.setItem('businessName', data.businessName);
        localStorage.setItem('firstName', data.firstName);
        localStorage.setItem('lastName', data.lastName);
      }

      setIsLoading(true);

      try {
        await dispatch(signupWithPassword({ ...data, userType }));
      } catch (e) {}

      setIsLoading(false);
    },
    [dispatch, userType]
  );

  return (
    <>
      <div className="flex-1 flex items-center">
        <NewAccountForm userType={userType} isLoading={isLoading} onSubmit={onSignup} />
      </div>
      <UserTypeModal isOpen={!userType} onChange={setUserType} />
    </>
  );
};

export default SignupPage;
