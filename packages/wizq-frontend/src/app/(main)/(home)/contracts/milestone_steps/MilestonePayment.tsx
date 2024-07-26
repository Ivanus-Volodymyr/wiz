import React, { useEffect, useMemo } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm, Controller, useFieldArray } from 'react-hook-form';
import { ContractsStepProps } from '../layout';
import {
  Contracts,
  ContractsPaymentType,
  ContractsResponse,
  ContractsType,
  MilestoneAmountType,
} from '../../../../../types/contracts';
import Input from '../../../../../components/common/Input';
import { AmountItem, UsdStartInputIcon } from '../../../../../components/contracts';

import IconButton from '../../../../../components/common/IconButton';
import PlusIcon from '../../../../../assets/icons/Icons=Plus.svg';
import { useSelector } from '../../../../../store';
import { useSetContractsMutation } from '../../../../../store/projects';
import { errorToast } from '../../../../../lib/toast';
import AppLink from '../../../../../components/common/AppLink';
import { add } from 'date-fns';

export default function MilestonePayment({ step, setStep, refetch }: ContractsStepProps) {
  const authInfo = useSelector((state) => state.auth.user);
  const { contracts } = useSelector((state) => state.contracts);
  const [setContracts] = useSetContractsMutation();

  const defaultValues: Contracts = useMemo(
    () => ({
      contract_amount: contracts?.[0]?.contract_amount || '',
      milestones:
        contracts && contracts?.[0]?.milestones?.length
          ? contracts?.[0]?.milestones
          : [
              {
                name: '',
                amount: '',
              },
              {
                name: '',
                amount: '',
              },
            ],
    }),
    [contracts]
  );

  const schema = yup.object({
    contract_amount: yup
      .string()
      .test('is-more-zero', 'Please enter an amount for the contract.', (value) => Number(value) > 0)
      .required('Please enter an amount for the contract.'),
    milestones: yup.array().of(
      yup.object().shape({
        name: yup.string().required('Please add a name for the milestone.'),
        amount: yup
          .string()
          .test('is-more-zero', 'Please enter an amount for the milestone.', (value) => Number(value) > 0)
          .required('Please enter an amount for the milestone.'),
      })
    ),
  });

  const methods = useForm<ContractsPaymentType>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'milestones',
  });

  useEffect(() => {
    reset(defaultValues);
  }, [contracts]);

  const handleAddMilestone = () => {
    reset({ milestones: fields }, { keepDirtyValues: true, keepErrors: true, keepValues: true });
    append({ name: '', amount: '' });
  };

  const handlerSubmit = async (data: Contracts) => {
    let totalAmount = 0;

    if (contracts && contracts?.[0]?.start_date) {
      if (add(new Date(contracts?.[0]?.start_date), { days: 1 }) < new Date()) {
        errorToast('The start date of contracts must be same to today or more than today.\n Please check again');
        return;
      }
    }

    data?.milestones?.filter((rs: MilestoneAmountType) => {
      totalAmount += parseFloat(rs.amount);
    });

    if (totalAmount > parseFloat(data?.contract_amount)) {
      errorToast(`Please ensure that the total of your milestone amounts doesn't surpass the contract amount.`);
      return;
    }

    const resData = (await setContracts({
      ...data,
      id: contracts?.[0]?.id || '-1',
      contract_type: ContractsType.milestone,
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
          <div className="mb-8">
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
          <div className="flex justify-between gap-5">
            <div className="flex justify-between gap-[10px] w-full">
              <label className="text-base font-bold w-[58%] flex gap-1">
                Milestones <span className="block md:hidden">amount</span>
              </label>
              <label className="text-base font-bold w-[42%] hidden md:block">Amount</label>
            </div>
            <div></div>
          </div>
          <div className="w-full mb-6">
            {fields?.map((_, key: number) => (
              <AmountItem
                key={key}
                control={control}
                isSubmitted={isSubmitted}
                index={key + 1}
                fields={fields}
                remove={remove}
              />
            ))}
          </div>
          <div onClick={handleAddMilestone} className="flex items-center cursor-pointer">
            <IconButton type="button" icon={<PlusIcon className="fill-accent-white" />} />
            <AppLink color="primary" className="font-bold">
              Add milestone
            </AppLink>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
