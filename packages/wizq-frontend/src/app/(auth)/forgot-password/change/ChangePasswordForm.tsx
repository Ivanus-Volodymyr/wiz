import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Button from '../../../../components/common/Button';
import AuthInput from '../../../../components/auth/AuthInput';
import classNames from 'classnames';

import LockIcon from '../../../../assets/icons/Icons=lock, Property 1=Variant55.svg';

interface ChangePasswordProps {
  onSubmit: (data: { password: string }) => Promise<void>;
}

export default function ChangePasswordForm({ onSubmit }: ChangePasswordProps) {
  const schema = yup.object({
    password: yup
      .string()
      .required('Please enter the password.')
      .matches(
        /^.*(?=^.{8,}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_\-+=[\]{};:'",.|`~№<>/\\?]).*$/,
        'At least 8 characters in length\n' +
          '\n' +
          '* Contain at least 3 of the following 4 types of characters:\n' +
          '\n' +
          '* lower case letters (a-z)\n' +
          '\n' +
          '* upper case letters (A-Z)\n' +
          '\n' +
          '* numbers (i.e. 0-9)\n' +
          '\n' +
          '* special characters (e.g. !@#$%^&*)'
      ),
    confirmPassword: yup
      .string()
      .required('Please repeat the password.')
      .oneOf([yup.ref('password')], 'Passwords do not match. Please try again.'),
  });

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<{ password: string; confirmPassword: string }>({
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(schema),
  });

  return (
    <>
      <h1 className="text-[48px] text-[#424A52] font-medium font-montserrat mb-6">Create New Password</h1>
      <h4 className="text-2xl text-[#424A52] font-montserrat mb-8">Please change your new password below:</h4>
      <form id="forgot-form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="text-[#0D1835] block mb-2 font-bold text-base">Create New Password</label>
          <Controller
            control={control}
            name="password"
            rules={{ required: true, minLength: 8 }}
            render={({ field: { name, value, onChange } }) => (
              <AuthInput
                name={name}
                value={value}
                onChange={(e) => {
                  onChange(e);
                  void trigger(['password', 'confirmPassword']);
                }}
                placeholder="Enter password"
                type="password"
                errors={errors}
              >
                <LockIcon className="stroke-main-secondary" />
              </AuthInput>
            )}
          />
        </div>
        <div
          className={classNames({
            'mt-8': errors?.password?.message?.length > 40,
          })}
        >
          <label className="text-[#0D1835] block mb-2 font-bold text-base">Confirm Password</label>
          <Controller
            control={control}
            name="confirmPassword"
            rules={{ required: true }}
            render={({ field: { name, value, onChange } }) => (
              <AuthInput
                name={name}
                value={value}
                onChange={(e) => {
                  onChange(e);
                  void trigger(['password', 'confirmPassword']);
                }}
                placeholder="Enter password"
                type="password"
                errors={errors}
              >
                <LockIcon className="stroke-main-secondary" />
              </AuthInput>
            )}
          />
        </div>
      </form>
      <Button type="submit" form="forgot-form" block color="primary" className="mb-64">
        Save New Password
      </Button>
      <p className="text-base text-center">
        Need Help?{' '}
        <Link href="/contact-us" className="text-black font-bold">
          Contact Us
        </Link>
      </p>
    </>
  );
}
