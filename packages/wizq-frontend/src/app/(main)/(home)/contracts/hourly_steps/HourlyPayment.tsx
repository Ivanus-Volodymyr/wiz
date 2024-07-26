'use client';

import React, { useEffect, useMemo } from 'react';
import { Contracts, ContractsPaymentType, ContractsResponse, ContractsType } from '../../../../../types/contracts';
import { ContractsStepProps } from '../layout';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from '../../../../../store';
import { useSetContractsMutation } from '../../../../../store/projects';

import Input from '../../../../../components/common/Input';
import { add } from 'date-fns';
import { errorToast } from '../../../../../lib/toast';

import { AttachMoney } from '@mui/icons-material';
import { UsdStartInputIcon } from '../../../../../components/contracts';

export default function HourlyPayment({ step, setStep, refetch }: ContractsStepProps) {
  const authInfo = useSelector((state) => state.auth.user);
  const { contracts } = useSelector((state) => state.contracts);
  const [setContracts] = useSetContractsMutation();

  const defaultValues: Contracts = useMemo(
    () => ({
      contract_amount: contracts?.[0]?.contract_amount || '',
      hourly_rate: contracts?.[0]?.hourly_rate || '',
      weekly_limit: contracts?.[0]?.weekly_limit || '',
    }),
    [contracts]
  );

  const schema = yup.object({
    contract_amount: yup
      .string()
      .test('is-more-zero', 'Please enter an amount for the contract.', (value) => Number(value) > 0)
      .required('Please enter an amount for the contract.'),
    hourly_rate: yup
      .string()
      .test('is-more-zero', 'Please enter a hourly rate.', (value) => Number(value) > 0)
      .required('Please enter a hourly rate.'),
    weekly_limit: yup
      .string()
      .test('is-more-zero', 'Please enter a weekly limit.', (value) => Number(value) > 0)
      .required('Please enter a weekly limit.'),
  });

  const methods = useForm<ContractsPaymentType>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [contracts]);

  const handlerSubmit = async (data: Contracts) => {
    if (contracts && contracts?.[0]?.start_date) {
      if (add(new Date(contracts?.[0]?.start_date), { days: 1 }) < new Date()) {
        errorToast('The start date of contracts must be same to today or more than today.\n Please check again');
        return;
      }
    }

    const resData = (await setContracts({
      ...data,
      id: contracts?.[0]?.id || '-1',
      contract_type: ContractsType.hourly,
      authorId: authInfo?.id,
    })) as { data: ContractsResponse };

    if (resData?.data) {
      refetch();
      setStep((preStep) => preStep + 1);
    }
  };

  return (
    <div className="w-full xl:w-[650px] px-7">
      <div className="w-full flex items-center justify-between mb-14">
        <h1 className="text-2xl text-[#0D1835] font-montserrat font-bold">Payment information</h1>
      </div>
      <FormProvider {...methods}>
        <form id={step} onSubmit={handleSubmit(handlerSubmit)}>
          <div className="mb-[87px]">
            <Controller
              control={control}
              name="contract_amount"
              render={({ field }) => (
                <Input
                  id="contract-amount"
                  isSubmitted={isSubmitted}
                  error={errors.contract_amount?.message || ''}
                  className="w-full font-medium max-w-full !pl-14"
                  label="Contract amount"
                  startIcon={<UsdStartInputIcon />}
                  placeholder="Enter amount"
                  number={true}
                  {...field}
                />
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full">
              <Controller
                control={control}
                name="hourly_rate"
                render={({ field }) => (
                  <Input
                    id="hourly-rate"
                    isSubmitted={isSubmitted}
                    error={errors.hourly_rate?.message || ''}
                    className="w-full font-medium max-w-full !pl-14"
                    label="Hourly rate"
                    startIcon={<UsdStartInputIcon />}
                    placeholder="Enter rate"
                    number={true}
                    {...field}
                  />
                )}
              />
            </div>
            <p className="text-4 text-[#788398] font-medium mb-0 mt-2 ml-[-10px]">/hr</p>
            <div className="w-full">
              <Controller
                control={control}
                name="weekly_limit"
                render={({ field }) => (
                  <Input
                    id="weekly-limit"
                    isSubmitted={isSubmitted}
                    error={errors.weekly_limit?.message || ''}
                    className="w-full font-medium max-w-full"
                    label="Weekly Limit"
                    placeholder="Enter weekly limit"
                    number={true}
                    {...field}
                  />
                )}
              />
            </div>
            <p className="text-4 text-[#788398] font-medium mb-0 mt-2 ml-[-10px]">hrs</p>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
