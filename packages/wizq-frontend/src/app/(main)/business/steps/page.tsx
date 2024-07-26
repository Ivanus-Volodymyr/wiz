'use client';

import React, { useState } from 'react';

import { Steps } from '../../../../container';
import BusinessOverview from './BusinessOverview';
import BusinessService from './BusinessService';
import BusinessLocation from './BusinessLocation';
import BusinessReach from './BusinessReach';
import BusinessHourlyRate from './BusinessHourlyRate';
import BusinessProjects from './BusinessProjects';
import { useGetBusinessesQuery, useGetCategoriesQuery, useGetServicesQuery } from '../../../../store/projects';

export interface BusinessPageProps {
  step?: string;
  setStep?: React.Dispatch<React.SetStateAction<number>>;
  refetch?: any;
  checked?: boolean;
  setChecked?: React.Dispatch<React.SetStateAction<boolean>>;
  error?: boolean;
  setError?: React.Dispatch<React.SetStateAction<boolean>>;
}

const items = [
  {
    title: 'Business overview',
  },
  {
    title: 'Services',
  },
  {
    title: 'Location',
  },
  {
    title: 'Reach',
  },
  {
    title: 'Hourly rate',
  },
  {
    title: 'Projects',
  },
];

export default function StepsPage() {
  const { refetch } = useGetBusinessesQuery({});
  useGetCategoriesQuery();
  useGetServicesQuery();

  const [step, setStep] = useState<number>(1);
  const [checked, setChecked] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  return (
    <Steps step={step} items={items} setStep={setStep} checked={checked} setError={setError} view="business">
      {step === 1 && <BusinessOverview step={step.toString()} setStep={setStep} refetch={refetch} />}
      {step === 2 && <BusinessService step={step.toString()} setStep={setStep} refetch={refetch} />}
      {step === 3 && <BusinessLocation step={step.toString()} setStep={setStep} refetch={refetch} />}
      {step === 4 && <BusinessReach step={step.toString()} setStep={setStep} refetch={refetch} />}
      {step === 5 && <BusinessHourlyRate step={step.toString()} setStep={setStep} refetch={refetch} />}
      {step === 6 && (
        <BusinessProjects
          refetch={refetch}
          checked={checked}
          setChecked={setChecked}
          error={error}
          setError={setError}
        />
      )}
    </Steps>
  );
}
