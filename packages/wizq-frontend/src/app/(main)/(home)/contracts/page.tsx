'use client';

import { useRouter } from 'next/navigation';
import Button from '../../../../components/common/Button';

export default function ContractsList() {
  const router = useRouter();

  return (
    <div className="p-5 lg:p-16">
      <div className="w-full flex flex-col gap-6 sm:flex-row sm:gap-0 justify-between">
        <h3 className="font-montserrat text-4xl font-bold leading-[58px]">All Contracts</h3>
        <Button type="button" onClick={() => router.push('/contracts/new_contract')} color={'primary'}>
          New contract
        </Button>
      </div>
    </div>
  );
}
