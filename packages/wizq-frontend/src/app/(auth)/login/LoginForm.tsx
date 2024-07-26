import React from 'react';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import Image from 'next/image';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { authoriseWithGoogle } from '../../../store/projects';
import Button from '../../../components/common/Button';
import AuthInput from '../../../components/auth/AuthInput';
import EmailIcon from '../../../assets/icons/Icons=Envelope.svg';
import LockIcon from '../../../assets/icons/Icons=lock, Property 1=Variant55.svg';

interface Props {
  isLoading?: boolean;
  onSubmit: (data: { email: string; password: string }) => Promise<void>;
}

const formId = 'signup-form';

const LoginForm = ({ isLoading, onSubmit }: Props) => {
  const loginFormSchema = yup.object({
    email: yup.string().email('Invalid email address.').required('Email field is required'),
    password: yup.string().required('Password field is required').min(8, 'Password must be at least 8 characters'),
  });

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<{ email: string; password: string }>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(loginFormSchema),
  });

  async function googleAuthorizeHandler() {
    await authoriseWithGoogle();
  }

  return (
    <div>
      <h1 className="font-medium text-[40px] mb-4">Welcome, sign into your account</h1>
      <p className="mt-0.5 mb-20">
        Create a new account to access more features on{' '}
        <Link className="text-main-primary" href="/signup#google-authorize">
          WizQuotes
        </Link>
      </p>
      <form id={formId} onSubmit={handleSubmit(onSubmit)} className="mb-14">
        <div>
          <label className="text-main-secondary block mb-2 font-bold">Email</label>
          <Controller
            control={control}
            name="email"
            render={({ field: { name, value, onChange } }) => (
              <AuthInput name={name} value={value} onChange={onChange} placeholder="Email" type="email" errors={errors}>
                <EmailIcon className="stroke-main-secondary stroke-2 scale-[0.8]" />
              </AuthInput>
            )}
          />
        </div>
        <div className="relative">
          <label className="text-main-secondary block mb-2 font-bold">Password</label>
          <Controller
            control={control}
            name="password"
            render={({ field: { name, value, onChange } }) => (
              <AuthInput
                name={name}
                value={value}
                onChange={onChange}
                placeholder="Enter password"
                type="password"
                errors={errors}
              >
                <LockIcon className="stroke-main-secondary" />
              </AuthInput>
            )}
          />
          <div className="absolute right-0 bottom-0">
            <Link href="/forgot-password/request" className="text-base text-[#017EFF] font-bold">
              Forgot password
            </Link>
          </div>
        </div>
      </form>
      <Button type="submit" form={formId} block color="primary" isLoading={isLoading} disabled={!isValid}>
        Sign In
      </Button>
      <div className="m-8 text-center">Or</div>
      <Button color="secondary" block onClick={googleAuthorizeHandler}>
        <Image
          className="inline-block mr-4"
          src="/assets/auth/google-logo-sm.png"
          width={24}
          height={24}
          alt=""
          aria-hidden
        />
        Sign In With Google
      </Button>
      <p className="mt-16 text-center">
        Don’t have an account?{' '}
        <Link href="/signup#google-authorize" className="text-main-primary">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
