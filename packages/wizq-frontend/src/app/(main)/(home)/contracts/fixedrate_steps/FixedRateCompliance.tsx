import React, { useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { ContractsStepProps } from '../layout';
import DatePickerComponent from '../../../../../components/common/DatePickerComponent';
import { add } from 'date-fns';
import Input from '../../../../../components/common/Input';
import { useSelector } from '../../../../../store';
import {
  NoticePeriodUnit,
  type ContractsComplianceType,
  type Contracts,
  ContractsType,
} from '../../../../../types/contracts';
import { FileType } from '../../../../../types';
import { useDeleteContractsFileByIdMutation, useSetContractsMutation } from '../../../../../store/projects/contracts';
import { errorToast } from '../../../../../lib/toast';
import FileUpload from '../../../../../components/common/FileUpload';

import CalendarIcon from '../../../../../assets/icons/Icons=Calendar.svg';
import TimerIcon from '../../../../../assets/icons/Icons=Times_1.svg';

export default function FixedRateCompliance({ step, setStep, refetch }: ContractsStepProps) {
  const authInfo = useSelector((state) => state.auth.user);
  const { contracts } = useSelector((state) => state.contracts);
  const [deleteFileById] = useDeleteContractsFileByIdMutation();
  const [setContracts] = useSetContractsMutation();

  const [date, setDate] = useState<Date>(add(new Date(), { days: 1 }));
  const [originalFiles, setOriginalFiles] = useState<File[]>([]);

  const defaultValues: Contracts = useMemo(
    () => ({
      termination_date: contracts?.[0]?.termination_date || '',
      notice_period: contracts?.[0]?.notice_period || '',
      period_unit: contracts?.[0]?.period_unit || NoticePeriodUnit.days,
      files: contracts?.[0]?.files || [],
    }),
    [contracts]
  );

  const schema = yup.object({
    termination_date: yup.string().required('Please select a termination date.'),
    notice_period: yup.string().required('Please enter a notice period.'),
    files: yup.array().test('required-files', 'Please select one or more documents.', () => {
      return [...defaultValues.files, ...originalFiles].length > 0;
    }),
  });

  const methods = useForm<ContractsComplianceType>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    setValue,
    clearErrors,
  } = methods;

  useEffect(() => {
    if (contracts?.[0]?.files && contracts?.[0]?.files?.length) {
      setValue('files', contracts?.[0]?.files, { shouldValidate: true });
    }
  }, [contracts]);

  const handleDeleteFile = async (fileId: string) => {
    const resData = (await deleteFileById({ id: fileId })) as { data: undefined };

    if (resData) {
      refetch();
      setValue('files', resData?.data as FileType[] | [], { shouldValidate: true });
    }
  };

  const handleUpload = async () => {
    clearErrors('files');
  };

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
      contract_type: ContractsType.fixed_rate,
      authorId: authInfo?.id,
      files: originalFiles,
    })) as { data: undefined };

    if (resData?.data) {
      refetch();
      setOriginalFiles([]);
      setStep((preStep) => preStep + 1);
    }
  };

  return (
    <div className="w-full xl:w-[650px] px-7">
      <div className="w-full flex items-center justify-between mb-14">
        <h1 className="text-2xl text-[#0D1835] font-montserrat font-bold">Contract compliance</h1>
      </div>
      <FormProvider {...methods}>
        <form id={step} onSubmit={handleSubmit(handlerSubmit)}>
          <div className="mb-16">
            <Controller
              control={control}
              name="termination_date"
              render={({ field }) => (
                <DatePickerComponent
                  id="termination-date"
                  label="Termination date"
                  isSubmitted={isSubmitted}
                  error={errors.termination_date?.message || ''}
                  className="w-full font-medium"
                  placeholder="Select termination date"
                  startIcon={<CalendarIcon />}
                  minDate={date}
                  setDate={setDate}
                  helperMessage="You’ll make payments to the service provider after each milestone until the contract has been concluded."
                  {...field}
                />
              )}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-10 mb-14">
            <Controller
              control={control}
              name="notice_period"
              render={({ field }) => (
                <Input
                  id="notice-period"
                  isSubmitted={isSubmitted}
                  error={errors.notice_period?.message || ''}
                  className="w-full font-medium max-w-full"
                  label="Notice period"
                  startIcon={<TimerIcon />}
                  placeholder="Enter notice period"
                  helperMessage="Either party can terminate this contract by the notice period set after which contract would be terminated"
                  number={true}
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="period_unit"
              render={({ field }) => (
                <select
                  id="period-unit"
                  className="cursor-pointer text-main-primary font-bold focus:outline-none mt-14"
                  {...field}
                >
                  <option value={NoticePeriodUnit.days}>Days</option>
                  <option value={NoticePeriodUnit.month}>Month</option>
                </select>
              )}
            />
          </div>
          <div>
            <label className="font-bold">Additional contract documents</label>
            <Controller
              control={control}
              name="files"
              render={({ field }) => (
                <FileUpload
                  onFileDelete={handleDeleteFile}
                  className="mt-7"
                  originalFiles={originalFiles}
                  setOriginalFiles={setOriginalFiles}
                  extension="docs"
                  helperMessage="*.pdf, *.doc or *.docx (max quantity: 5)"
                  error={errors.files?.message || ''}
                  onFileUpload={handleUpload}
                  {...field}
                />
              )}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
