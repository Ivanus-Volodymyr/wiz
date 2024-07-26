'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ContractsStepProps } from '../layout';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from '../../../../../store';
import { useSetContractsMutation } from '../../../../../store/projects';

import Input from '../../../../../components/common/Input';
import Select from '../../../../../components/common/Select';
import DatePickerComponent from '../../../../../components/common/DatePickerComponent';
import {
  Contracts,
  ContractsType,
  PaymentFrequency,
  InvoiceCycleEnds,
  ContractsPaymentType,
  ContractsResponse,
} from '../../../../../types/contracts';
import { add } from 'date-fns';
import { errorToast } from '../../../../../lib/toast';

import { UsdStartInputIcon } from '../../../../../components/contracts';

export default function FixedRatePayment({ step, setStep, refetch }: ContractsStepProps) {
  const authInfo = useSelector((state) => state.auth.user);
  const { contracts } = useSelector((state) => state.contracts);
  const [setContracts] = useSetContractsMutation();

  const [date, setDate] = useState<Date>(new Date());

  const changeInvoiceCycleLower = (value: string) => {
    if (value === 'DAY_26_MONTH') {
      return '26th day of the month';
    }

    if (value === 'DAY_27_MONTH') {
      return '27th day of the month';
    }

    if (value === 'DAY_28_MONTH') {
      return '28th day of the month';
    }

    if (value === 'DAY_29_MONTH') {
      return '29th day of the month';
    }

    if (value === 'DAY_30_MONTH') {
      return '30th day of the month';
    }

    if (value === 'LAST_DAY_MONTH') {
      return 'Last day of the month';
    }

    return '';
  };

  const changeInvoiceCycleLetter = (value: string) => {
    if (value === '26th day of the month') {
      return 'DAY_26_MONTH';
    }

    if (value === '27th day of the month') {
      return 'DAY_27_MONTH';
    }

    if (value === '28th day of the month') {
      return 'DAY_28_MONTH';
    }

    if (value === '29th day of the month') {
      return 'DAY_29_MONTH';
    }

    if (value === '30th day of the month') {
      return 'DAY_30_MONTH';
    }

    if (value === 'Last day of the month') {
      return 'LAST_DAY_MONTH';
    }
  };

  const defaultValues: Contracts = useMemo(
    () => ({
      payment_rate: contracts?.[0]?.payment_rate || '',
      payment_frequency: contracts?.[0]?.payment_frequency || '',
      invoice_cycle_ends: changeInvoiceCycleLower(contracts?.[0]?.invoice_cycle_ends || ''),
      payment_due_date: contracts?.[0]?.payment_due_date || '',
      payment_first_day: contracts?.[0]?.payment_first_day || '',
      payment_amount: contracts?.[0]?.payment_amount || '',
    }),
    [contracts]
  );

  const schema = yup.object({
    payment_rate: yup
      .string()
      .test('is-more-zero', 'Please enter a payment rate.', (value) => Number(value) > 0)
      .required('Please enter a payment rate.'),
    payment_frequency: yup.string().required('Please select a payment frequency.'),
    invoice_cycle_ends: yup.string().required('Please select when the invoice cycle should end.'),
    payment_due_date: yup.string().required('Please select a payment due date.'),
    payment_first_day: yup.string().required('Please select a first day of payment.'),
    payment_amount: yup
      .string()
      .test('is-more-zero', 'Please select a payment amount.', (value) => Number(value) > 0)
      .required('Please select a payment amount.'),
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
      invoice_cycle_ends: changeInvoiceCycleLetter(data.invoice_cycle_ends),
      id: contracts?.[0]?.id || '-1',
      contract_type: ContractsType.fixed_rate,
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
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-20">
            <div className="w-full">
              <Controller
                control={control}
                name="payment_rate"
                render={({ field }) => (
                  <Input
                    id="payment-rate"
                    isSubmitted={isSubmitted}
                    error={errors.payment_rate?.message || ''}
                    className="w-full font-medium max-w-full !pl-14"
                    label="Payment rate"
                    startIcon={<UsdStartInputIcon />}
                    placeholder="Enter rate"
                    number={true}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="w-full">
              <Controller
                control={control}
                name="payment_frequency"
                render={({ field }) => (
                  <Select
                    addNewInputType="text"
                    label="Payment frequency"
                    id="payment-frequency"
                    placeholder="Select payment frequency"
                    className="w-full"
                    options={PaymentFrequency}
                    error={errors.payment_frequency?.message || ''}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <p className="text-xl text-[#000] font-medium font-montserrat mb-10">Invoicing</p>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
            <div className="w-full">
              <Controller
                control={control}
                name="invoice_cycle_ends"
                render={({ field }) => (
                  <Select
                    addNewInputType="text"
                    label="Invoice cycle ends"
                    id="invoice-cycle-ends"
                    placeholder="Select end day"
                    className="w-full"
                    options={InvoiceCycleEnds}
                    error={errors.invoice_cycle_ends?.message || ''}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="w-full">
              <Controller
                control={control}
                name="payment_due_date"
                render={({ field }) => (
                  <DatePickerComponent
                    id="payment-due-date"
                    label="Payment due date"
                    error={errors.payment_due_date?.message || ''}
                    isSubmitted={isSubmitted}
                    className="w-full font-medium"
                    placeholder="Select due date"
                    minDate={new Date()}
                    setDate={setDate}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full">
              <Controller
                control={control}
                name="payment_first_day"
                render={({ field }) => (
                  <DatePickerComponent
                    id="payment-first-day"
                    label="First day of payment"
                    error={errors.payment_first_day?.message || ''}
                    isSubmitted={isSubmitted}
                    className="w-full font-medium"
                    placeholder="Select first day"
                    minDate={new Date()}
                    setDate={setDate}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="w-full">
              <Controller
                control={control}
                name="payment_amount"
                render={({ field }) => (
                  <Input
                    id="payment-amount"
                    isSubmitted={isSubmitted}
                    error={errors.payment_amount?.message || ''}
                    className="w-full font-medium max-w-full"
                    label="Payment amount"
                    placeholder="Enter payment amount"
                    number={true}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
