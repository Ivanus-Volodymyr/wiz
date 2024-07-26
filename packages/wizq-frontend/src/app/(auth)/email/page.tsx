'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useInterval from '../../../utils/useInterval';

import Button from '../../../components/common/Button';
import { useDispatch, useSelector } from '../../../store';
import { getAuth0Token, resendVerifyEmail } from '../../../store/projects';

import EmailIcon from '../../../assets/icons/Icons=Email.svg';

export default function EmailPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { authToken, user } = useSelector((state) => state.auth);

  const [intervalDelay, setIntervalDelay] = useState<number>(1000);
  const [decrement, setDecrement] = useState<number>(45);
  const [active, setActive] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      router.replace('/');
      return;
    }

    void dispatch(getAuth0Token());
  }, [dispatch]);

  const handleCountDown = () => {
    let dec = decrement;

    if (dec <= 0) {
      setDecrement(45);
      setIntervalDelay(-1);
      setActive(false);
    } else {
      dec -= 1;
      setDecrement(dec);
      setActive(true);
    }
  };

  useInterval(() => {
    handleCountDown();
  }, intervalDelay);

  const handleEmail = async () => {
    await resendVerifyEmail(authToken, user?.auth0UserId);
    setIntervalDelay(1000);
    setActive(true);
  };

  const handleBack = () => {
    window.localStorage.setItem('routeInfo', 'email');
    window.location.replace('/');
  };

  return (
    <div>
      <EmailIcon />
      <h1 className="text-5xl font-medium mb-8 font-montserrat">We’ve sent you an email!</h1>
      <p className="text-2xl mb-[100px]">Please click on the verification link in your email</p>
      <div className="text-[#017EFF] font-bold text-lg cursor-pointer" onClick={handleBack}>
        Go back
      </div>
      <p className="text-lg my-10 h-[54px]">
        I didn’t get an email from Wizquotes.{' '}
        <span className="text-[#017EFF]">Resend in {decrement.toString().padStart(2, '0')} secs</span>
      </p>
      <Button color="primary" block className="mb-44" disabled={active} onClick={() => void handleEmail()}>
        Resend Verification Email
      </Button>
      <p className="text-base">
        Need Help?{' '}
        <Link href="/contact-us" className="text-black font-bold">
          Contact Us
        </Link>
      </p>
    </div>
  );
}
