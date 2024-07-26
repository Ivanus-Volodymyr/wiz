import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { authoriseWithGoogle } from '../../../store/projects';
import { User, UserType, UserType1 } from '../../../types';
import Button from '../../../components/common/Button';
import AuthInput from '../../../components/auth/AuthInput';
import classNames from 'classnames';

import EmailIcon from '../../../assets/icons/Icons=Envelope.svg';
import UserIcon from '../../../assets/icons/Icons=User.svg';
import LockIcon from '../../../assets/icons/Icons=lock, Property 1=Variant55.svg';
import InfoCircle from '../../../assets/icons/Icons=Info-Cirlce.svg';
import BriefCaceIcon from '../../../assets/icons/Icons=Icons103, Property 1=Wizquotes icon.svg';
import { useSelector } from '../../../store';

yup.addMethod(yup.string, 'email', function validateEmail(message: string) {
  return this.matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message,
    name: 'email',
    excludeEmptyString: true,
  });
});

interface Props {
  isLoading: boolean;
  userType: UserType | null;
  onSubmit: (data: User & { password: string }) => Promise<void>;
}

const formId = 'signup-form';

const NewAccountForm = ({ isLoading, userType, onSubmit }: Props) => {
  const { businesses } = useSelector((state) => state.business);

  const signupSchema = yup.object({
    firstName: yup
      .string()
      .required('This is a required field.')
      .matches(/^(?!.*([A-Z][a-z]*[A-Z]|--|\s\s|[a-z][A-Z]))[A-Z][a-zA-Z-\s]*$/, 'Please enter a valid first name.')
      .test(
        'two-hyphen',
        'Please enter a valid first name.',
        (value) => value.split('').filter((char) => char === '-').length <= 2
      ),
    lastName: yup
      .string()
      .required('This is a required field.')
      .matches(/^(?!.*([A-Z][a-z]*[A-Z]|--|\s\s|[a-z][A-Z]))[A-Z][a-zA-Z-\s]*$/, 'Please enter a valid last name.')
      .test(
        'two-hyphen',
        'Please enter a valid first name.',
        (value) => value.split('').filter((char) => char === '-').length <= 2
      ),
    email: yup.string().email('Invalid email address. Please try again.').required('This is a required field.'),
    ...(userType === UserType1.SERVICE_PROVIDER
      ? {
          businessName: yup
            .string()
            .required('This is a required field.')
            .matches(
              /^[A-Z][a-zA-Z0-9~!@#$%^&*()-_=+\/?|{};:'",.<>]/,
              'Please enter a valid name. Valid name includes uppercase and lowercase letters of the alphabet, numeric characters 0 through 9, and the special characters, it must begin with an uppercase  letter of the alphabet.'
            )
            .test('same-name', 'This business name already exists.', (value: string) => {
              const exist = businesses?.find((f) => f.name.trim() === value.trim());
              return !exist;
            }),
        }
      : {}),
    password: yup
      .string()
      .required('Please enter the password.')
      .matches(
        /^(?:(?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))[A-Za-z0-9!~<>,;:_=?*+#.”&§$%°{}()\|\[\]\-\$\^\@\/]{8,}$/,
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
  } = useForm<User & { password: string; confirmPassword: string }>({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      businessName: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(signupSchema),
  });

  return (
    <div>
      <h1 className="font-medium text-[40px] mb-4 font-montserrat">
        {userType === UserType1.SERVICE_PROVIDER ? 'Sign up to enhance living spaces' : 'Create new account'}
      </h1>
      <p className="mt-0.5 mb-20">
        Create a new account to access more features on{' '}
        <Link className="text-main-primary" href="/">
          WizQuotes
        </Link>
      </p>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="text-main-secondary block mb-2 font-bold">First name</label>
            <Controller
              control={control}
              name="firstName"
              rules={{ required: true }}
              render={({ field: { name, value, onChange } }) => (
                <AuthInput name={name} value={value} onChange={onChange} placeholder="First name" errors={errors}>
                  <UserIcon className="stroke-main-secondary" />
                </AuthInput>
              )}
            />
          </div>
          <div className="flex-1">
            <label className="text-main-secondary block mb-2 font-bold">Last name</label>
            <Controller
              control={control}
              name="lastName"
              rules={{ required: true }}
              render={({ field: { name, value, onChange } }) => (
                <AuthInput name={name} value={value} onChange={onChange} placeholder="Last name" errors={errors}>
                  <UserIcon className="stroke-main-secondary" />
                </AuthInput>
              )}
            />
          </div>
        </div>
        <div className="flex gap-2 mb-5">
          <div>
            <InfoCircle className="fill-main-primary" />
          </div>
          <p className="text-label-disable text-sm">
            Valid name includes uppercase and lowercase letters of the alphabet and the special character "-", it must
            begin with an uppercase letter of the alphabet.
          </p>
        </div>
        <div>
          <label className="text-main-secondary block mb-2 font-bold">Email</label>
          <Controller
            control={control}
            name="email"
            rules={{ required: true }}
            render={({ field: { name, value, onChange } }) => (
              <AuthInput
                name={name}
                value={value}
                onChange={onChange}
                placeholder="Enter email"
                type="email"
                errors={errors}
              >
                <EmailIcon className="stroke-main-secondary stroke-2 scale-[0.8]" />
              </AuthInput>
            )}
          />
        </div>

        {userType === UserType1.SERVICE_PROVIDER && (
          <div>
            <label className="text-main-secondary block mb-2 font-bold">Business name</label>
            <Controller
              control={control}
              name="businessName"
              rules={{ required: true }}
              render={({ field: { name, value, onChange } }) => (
                <AuthInput
                  name={name}
                  value={value}
                  onChange={onChange}
                  placeholder="Enter your business name"
                  errors={errors}
                >
                  <BriefCaceIcon className="stroke-main-secondary stroke-2 scale-[0.8]" />
                </AuthInput>
              )}
            />
          </div>
        )}

        <div>
          <label className="text-main-secondary block mb-2 font-bold">Password</label>
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
          <label className="text-main-secondary block mb-2 font-bold">Re-enter password</label>
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
      <p className="mt-5 mb-12">
        By clicking &quot;Create Account&quot;, you agree to Wizquotes{' '}
        <Link href="/" className="text-main-primary">
          Terms of Use
        </Link>{' '}
        and acknowledge you have read the{' '}
        <Link href="/" className="text-main-primary">
          Privacy Policy
        </Link>
        .
      </p>
      <Button type="submit" form={formId} block color="primary" isLoading={isLoading}>
        Create Account
      </Button>
      <div className="m-8 text-center">Or</div>
      <Button
        id="google-authorize"
        color="secondary"
        block
        disabled={!userType}
        onClick={() => {
          if (!userType) return; // TS doesn't know that this is not null
          void authoriseWithGoogle({ userType });
        }}
      >
        <Image
          className="inline-block mr-4"
          src="/assets/auth/google-logo-sm.png"
          width={24}
          height={24}
          alt=""
          aria-hidden
        />
        Sign Up With Google
      </Button>
      <p className="mt-16 text-center">
        Already have an account?{' '}
        <Link href="/login" className="text-main-primary">
          Login
        </Link>
      </p>
    </div>
  );
};

export default NewAccountForm;
