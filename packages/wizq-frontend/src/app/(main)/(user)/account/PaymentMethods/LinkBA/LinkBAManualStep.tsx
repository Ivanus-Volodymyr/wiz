import React from 'react';

import Input from '../../../../../../components/common/Input';
import Checkbox from '../../../../../../components/common/Checkbox';
import Button from '../../../../../../components/common/Button';

import InfoCircle from '../../../../../../assets/icons/Icons=Info-Cirlce.svg';

import { AddBAFormData, PaymentInformationBA } from '../../../../../../types/payment';

import { useDispatch } from '../../../../../../store';
import { setNewBA, setPrimaryPayment } from '../../../../../../store/projects';

import { Controller, FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { successSnackbar } from '../../../../../../components/snackbar/AppSnackbar';
import BankIcon from '../../../../../../assets/icons/bank.svg';

type Props = {
  onCloseModal: () => void;
};

const LinkBAManualStep = ({ onCloseModal }: Props) => {
  const dispatch = useDispatch();

  const defaultValues: AddBAFormData = {
    accountNumber: '',
    confirmAccountNumber: '',
    routingNumber: '',
    makePrimary: false,
  };

  const addCardSchema = yup.object({
    accountNumber: yup.string().required('Please enter the account number.'),
    routingNumber: yup.string().required('Please enter the routing number.'),
    confirmAccountNumber: yup
      .string()
      .required('Please confirm the account number.')
      .oneOf([yup.ref('accountNumber')], 'Please confirm the account number.'),
  });

  const methods = useForm<AddBAFormData>({
    defaultValues,
    resolver: yupResolver(addCardSchema),
    resetOptions: { keepIsSubmitted: true },
  });

  const {
    reset,
    handleSubmit,
    control,
    trigger,
    formState: { errors, isSubmitted, dirtyFields },
  } = methods;

  const allFieldsAreDirty = dirtyFields.accountNumber && dirtyFields.confirmAccountNumber && dirtyFields.routingNumber;

  const createDummyBA = (newBA: PaymentInformationBA) => {
    dispatch(setNewBA(newBA));
  };
  const submitFormHandler = (data: AddBAFormData) => {
    const newBA: PaymentInformationBA = {
      id: Math.random().toString(),
      bank: 'Royal Bank of Canada',
      digits: data.accountNumber.trim().slice(-4),
    };
    if (data.makePrimary) {
      dispatch(setPrimaryPayment(newBA.id));
    }
    onCloseModal();
    reset(defaultValues);
    createDummyBA(newBA);
    successSnackbar('Your bank account has been linked successfully', <BankIcon className="stroke-white" />);
  };

  return (
    <div className="py-10 px-7">
      <p className="text-left">Enter card details to add this payment method</p>
      <div className="mt-8 px-1 text-left">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(submitFormHandler)}>
            <div className="flex flex-col gap-8">
              <Controller
                control={control}
                name="routingNumber"
                render={({ field }) => (
                  <Input
                    id="routingNumber"
                    number
                    error={errors.routingNumber?.message || ''}
                    isSubmitted={isSubmitted}
                    className="w-full font-medium"
                    label="Routing Number"
                    placeholder="Enter routing number"
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name="accountNumber"
                render={({ field }) => (
                  <Input
                    id="accountNumber"
                    number
                    error={errors.accountNumber?.message || ''}
                    isSubmitted={isSubmitted}
                    className="w-full font-medium"
                    label="Account Number"
                    placeholder="Enter account number"
                    onChange={(e) => {
                      field.onChange(e);
                      void trigger(['accountNumber', 'confirmAccountNumber']);
                    }}
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name="confirmAccountNumber"
                render={({ field }) => (
                  <Input
                    id="confirmAccountNumber"
                    number
                    error={errors.confirmAccountNumber?.message || ''}
                    isSubmitted={isSubmitted}
                    className="w-full font-medium"
                    label="Confirm Account Number"
                    placeholder="Confirm account number"
                    onChange={(e) => {
                      field.onChange(e);
                      void trigger(['accountNumber', 'confirmAccountNumber']);
                    }}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="mt-6 space-y-6">
              <div className="px-4 py-3 bg-background-subtleNeutral flex gap-2 items-center">
                <div>
                  <InfoCircle className="fill-main-primary" />
                </div>
                <p className="text-main-active text-sm">
                  You’ll receive two deposits and two withdrawals of less than $1 from your bank statement over the next
                  three days.
                </p>
              </div>
              <Controller
                control={control}
                name="makePrimary"
                render={({ field }) => (
                  <Checkbox
                    className="!text-base font-normal"
                    error={errors.makePrimary?.message || ''}
                    label="Make this primary payment method"
                    checked={field.value}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="mt-10 flex justify-between gap-6">
              <Button onClick={onCloseModal} color="primary" outline className="h-auto py-4 w-[20%] rounded-[3px]">
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                className="h-auto py-4 w-[80%] rounded-[3px]"
                disabled={!allFieldsAreDirty}
              >
                Save card
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default LinkBAManualStep;
