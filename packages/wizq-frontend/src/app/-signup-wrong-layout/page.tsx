'use client';
import Image from 'next/image';
import React, { useCallback, useState } from 'react';
import SignupStep from './SignupStep';
import Button from '../../components/common/Button';
import useQuery from '../../hooks/useQuery';
import Modal from '../../components/common/Modal';

const SignupPage = () => {
  const [step = '0', setStep] = useQuery<'0' | '1' | '2' | '3' | 'create_account_buttons' | 'create_account_form'>(
    'step'
  );
  const stepAsNumber = parseInt(step, 10);
  const [userType, setUserType] = useState<'home_owner' | 'service_provider' | null>(null);

  const onNext = useCallback(() => {
    let nextStep: typeof step;

    if (!Number.isNaN(stepAsNumber)) {
      if (stepAsNumber === 3) {
        nextStep = 'create_account_buttons';
      } else {
        nextStep = (stepAsNumber + 1).toString() as '1' | '2' | '3';
      }
    } else if (step === 'create_account_buttons') {
      nextStep = 'create_account_form';
    } else {
      throw new Error('Invalid step ' + step);
    }

    setStep(nextStep);
  }, [setStep, step, stepAsNumber]);

  const onSkip = useCallback(() => {
    setStep('create_account_buttons');
  }, [setStep]);

  return (
    <div className="min-h-full flex">
      <Modal isOpen={!userType}>
        <h3 className="text-4xl font-bold mr-12 mb-8 text-start">Select below to know more about Wizquotes:</h3>
        <Button color="primary" block className="mb-6" onClick={() => setUserType('home_owner')}>
          as Home Owner
        </Button>
        <Button color="secondary" block className="mb-6" onClick={() => setUserType('service_provider')}>
          as Services Provider
        </Button>
        <div className="mb-6 text-center">Or</div>
        <Button color="secondary" block outline onClick={() => alert('Not implemented')}>
          Just Login
        </Button>
      </Modal>
      <div className="min-h-full w-1/2 p-16 xl:p-32 flex flex-col">
        <Image src="/assets/logo.svg" alt="WizQuotes" width="255" height="48" className="w-[190px] xl:w-[255px]" />
        {!Number.isNaN(stepAsNumber) && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex items-center">
              <SignupStep step={step as '0' | '1' | '2' | '3'} onNext={onNext} />
            </div>
            <div className="text-center pt-8">
              <span className="cursor-pointer font-bold text-label-disable" onClick={onSkip}>
                Skip
              </span>
            </div>
          </div>
        )}
        {step === 'create_account_buttons' && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex items-center">
              <div>
                <h2 className="font-bold text-5xl mb-16">Interested using Wizquotes to improve your lovely home?</h2>
                <Button color="primary" block className="mb-8">
                  Create a New Account
                </Button>
                <div className="mb-8 text-center">Or</div>
                <Button color="secondary" block className="mb-12">
                  Sign Up With Google
                </Button>
                <p className="text-main-secondary">
                  Already have an account?{' '}
                  <span className="font-bold cursor-pointer" onClick={() => alert('Not implemented')}>
                    Login
                  </span>
                </p>
              </div>
            </div>
            <div className="text-main-secondary pt-8 text-start">
              Proceed with acceptance WizQuotes{' '}
              <span className="font-bold cursor-pointer" onClick={() => alert('Not implemented')}>
                Terms of Services
              </span>{' '}
              and{' '}
              <span className="font-bold cursor-pointer" onClick={() => alert('Not implemented')}>
                Privacy Policy
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="min-h-full w-1/2 flex-1 bg-label-disable flex items-center justify-center">
        <svg width="128" height="104" viewBox="0 0 128 104" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 0V104H128V0H0ZM9.14286 9.45455H118.857V75.192L94.7154 50.0807L91.4286 46.6818L70.7154 68.1011L44.4297 40.6262L41.1429 37.2273L9.14286 70.3182V9.45455ZM100.571 18.9091C98.1466 18.9091 95.8211 19.9052 94.1065 21.6783C92.3918 23.4513 91.4286 25.8561 91.4286 28.3636C91.4286 30.8711 92.3918 33.2759 94.1065 35.049C95.8211 36.8221 98.1466 37.8182 100.571 37.8182C102.996 37.8182 105.322 36.8221 107.036 35.049C108.751 33.2759 109.714 30.8711 109.714 28.3636C109.714 25.8561 108.751 23.4513 107.036 21.6783C105.322 19.9052 102.996 18.9091 100.571 18.9091ZM41.1429 50.6716L83.1451 94.5454H9.14286V83.7625L41.1429 50.6716ZM91.4286 60.1262L118.857 88.4898V94.5454H96.1417L77.1429 74.7476L91.4286 60.1262Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
};

export default SignupPage;
