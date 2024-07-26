import React, { ReactNode } from 'react';

export interface ContractsStepProps {
  step?: string;
  setStep?: React.Dispatch<React.SetStateAction<number>>;
  refetch?: any;
}

export const stepItems = [
  {
    title: 'General',
  },
  {
    title: 'Payment',
  },
  {
    title: 'Compliance',
  },
  {
    title: 'Review & sign',
  },
];

export default function ContractsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
