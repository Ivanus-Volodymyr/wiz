import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Button from '../../../../components/common/Button';
import AuthInput from '../../../../components/auth/AuthInput';

import EmailIcon from '../../../../assets/icons/Icons=Envelope.svg';

export default function RequestLinkPasswordForm({
  onSubmit,
  loading,
}: {
  onSubmit: (data: { email: string }) => Promise<void>;
  loading: boolean;
}) {
  const schema = yup.object({
    email: yup
      .string()
      .required('This is a required field.')
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address. Please try again.'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(schema),
  });

  return (
    <>
      <h1 className="text-[48px] text-[#424A52] font-medium font-montserrat mb-6">Reset Password</h1>
      <h4 className="text-2xl text-[#424A52] font-montserrat mb-8">
        We will send a link to your email e****@gmail.com to reset your password{' '}
      </h4>
      <form id="forgot-form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="text-[#0D1835] block mb-2 font-bold text-base">Enter your email</label>
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
      </form>
      <Button type="submit" form="forgot-form" block color="primary" className="mb-64" isLoading={loading}>
        Send Link Now
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
