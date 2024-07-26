'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { ContractsStepProps } from '../layout';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../../../../../components/common/Input';
import Select from '../../../../../components/common/Select';
import DatePickerComponent from '../../../../../components/common/DatePickerComponent';
import IconButton from '../../../../../components/common/IconButton';
import AppLink from '../../../../../components/common/AppLink';

import { useSelector } from '../../../../../store';
import { useGetProjectsByAuthIdQuery, useSetContractsMutation } from '../../../../../store/projects';
import { LoadProjectResponse } from '../../../../../types/project';
import { Contracts, ContractsGeneralType, ContractsResponse, ContractsType } from '../../../../../types/contracts';
import { format, add, sub } from 'date-fns';

import FlagIcon from '../../../../../assets/icons/Icons=Flag_1.svg';
import SearchIcon from '../../../../../assets/icons/Icons=Search.svg';
import CalendarIcon from '../../../../../assets/icons/Icons=Calendar.svg';
import DeclineIcon from '../../../../../assets/icons/Icons=Times.svg';
import Plus from '../../../../../assets/icons/Icons=Plus.svg';

export default function HourlyGeneral({ step, setStep, refetch }: ContractsStepProps) {
  const authInfo = useSelector((state) => state.auth.user);
  const { contracts } = useSelector((state) => state.contracts);
  const { data: projects } = useGetProjectsByAuthIdQuery(authInfo?.id);
  const [setContracts] = useSetContractsMutation();

  const [date, setDate] = useState<Date>(new Date());
  const [projectList, setProjectList] = useState<string[]>([]);
  const [providerList, setProviderList] = useState<string[]>([]);
  const [projectId, setProjectId] = useState<string>('');
  const [providerId, setProviderId] = useState<string>('');
  const [descriptionActive, setDescriptionActive] = useState<boolean>(false);

  const defaultValues: Contracts = useMemo(
    () => ({
      name: contracts?.[0]?.name?.trim() || '',
      description: contracts?.[0]?.description?.trim() || '',
      projectId: '',
      providerId: '',
      start_date: contracts?.[0]?.start_date || '',
      end_date: contracts?.[0]?.end_date || '',
    }),
    [contracts]
  );

  const schema = yup.object({
    projectId: yup.string().required('Please select your project.'),
    name: yup
      .string()
      .required('Please enter a name for the contract.')
      .test('', 'Please enter a name for the contract.', (value: string) => {
        if (value.trim() === '') return false;
        return true;
      }),
    ...(descriptionActive
      ? {
          description: yup
            .string()
            .required('Please add a description for the contract.')
            .test('', 'Please enter a description for the contract.', (value: string) => {
              if (value.trim() === '') return false;
              return true;
            }),
        }
      : {}),
    providerId: yup.string().required('Please select a service provider.'),
    start_date: yup
      .string()
      .required('Please select a start date for the contract.')
      .test('', 'The start date must be same to today or more than today.', (value: string, _) => {
        if (value !== '') {
          const setDate = add(new Date(value), { days: 1 });

          if (setDate < new Date()) {
            return false;
          }
        }

        return true;
      }),
    end_date: yup
      .string()
      .required('Please select an end date for the contract.')
      .test(
        '',
        'The end date must be more than the start date.',
        (value: string, context: yup.TestContext<yup.AnyObject>) => {
          if (value !== '' && context.parent.start_date !== '') {
            if (new Date(value) < new Date(context.parent.start_date)) {
              return false;
            }
          }

          return true;
        }
      ),
  });

  const methods = useForm<ContractsGeneralType>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitted },
  } = methods;

  useEffect(() => {
    reset(defaultValues);

    const projectData = projects?.map((rs: LoadProjectResponse) => {
      return `${rs.name}-${rs.id}`;
    });

    if (contracts) {
      if (contracts?.[0]?.start_date) {
        const minDate = new Date(contracts?.[0]?.start_date);

        if (format(minDate, 'yyyy-MM-dd') === contracts?.[0]?.start_date) {
          setDate(new Date(contracts?.[0]?.start_date));
        } else if (minDate > new Date(contracts?.[0]?.start_date)) {
          setDate(sub(minDate, { days: 1 }));
        } else {
          setDate(add(minDate, { days: 1 }));
        }
      }
    } else {
      setDate(new Date());
    }

    setProjectId(contracts?.[0]?.projectId || '');
    setProviderId(contracts && contracts?.[0]?.id ? contracts?.[0]?.providerId : '');
    setProjectList(projectData);

    const project = projects?.find((f) => f.id === contracts?.[0]?.projectId);
    const provider = project?.projectInvitation?.find((f) => f.providerId === contracts?.[0]?.providerId);

    const providerData = project?.projectInvitation?.map(
      (rs) => `${rs?.provider?.Business?.[0].name as string}-${rs?.provider?.id as string}`
    );

    setProviderList(providerData);
    setValue('projectId', project?.name || '');
    setValue('providerId', provider?.provider ? provider?.provider?.Business?.[0]?.name : '');
  }, [projects, contracts, reset]);

  const handleChangeProject = (id: string) => {
    setProviderId('');
    setProjectId('');
    setProviderList([]);

    if (id === 'clear') {
      setValue('providerId', '');
      return;
    }

    const findProject = projects.find((rs: LoadProjectResponse) => rs.id === id);
    const fiterProvider = findProject?.projectInvitation?.filter(
      (rs) => rs?.provider?.subType === 'PROVIDER' && rs?.provider?.Business?.length > 0
    );
    const providerData = fiterProvider?.map(
      (rs) => `${rs?.provider?.Business?.[0]?.name as string}-${rs?.provider?.id as string}`
    );

    setValue('providerId', '');
    setProjectId(id);
    setProviderList(providerData);
  };

  const handleChangeProvider = (id: string) => {
    setProviderId(id);
  };

  const handleChangeDate = (date: Date) => {
    if (getValues('end_date') && getValues('end_date') !== '') {
      if (date >= new Date(getValues('end_date'))) {
        setValue('end_date', format(add(date, { days: 1 }), 'yyyy-MM-dd'));
      }
    }

    setDate(date);
  };

  const handlerSubmit = async (data: Contracts) => {
    const resData = (await setContracts({
      ...data,
      name: data.name.trim(),
      description: data.description.trim(),
      id: contracts?.[0]?.id || '-1',
      projectId,
      providerId,
      contract_type: ContractsType.hourly,
      authorId: authInfo?.id,
    })) as { data: ContractsResponse };

    if (resData?.data) {
      refetch();
      setStep((preStep) => preStep + 1);
    }
  };

  const changeDescriptionActiveHandler = () => {
    setDescriptionActive((prevState) => !prevState);
  };

  return (
    <div className="w-full xl:w-[650px] px-7">
      <div className="w-full flex items-center justify-between mb-14">
        <h1 className="text-2xl text-[#0D1835] font-montserrat font-bold">General information</h1>
      </div>
      <FormProvider {...methods}>
        <form id={step} onSubmit={handleSubmit(handlerSubmit)}>
          <div className="mb-6">
            <Controller
              control={control}
              name="projectId"
              render={({ field }) => (
                <Select
                  addNewInputType="text"
                  label="Choose a project for this contract"
                  id="project"
                  placeholder="Search project"
                  className="w-full"
                  startIcon={<FlagIcon />}
                  options={projectList || []}
                  error={errors.projectId?.message || ''}
                  onChangeValue={handleChangeProject}
                  {...field}
                />
              )}
            />
          </div>
          <div className="mb-6">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  id="contract-name"
                  error={errors.name?.message || ''}
                  isSubmitted={isSubmitted}
                  className="w-full font-medium max-w-full"
                  label="Contract name"
                  placeholder="Enter contract name"
                  {...field}
                />
              )}
            />
          </div>
          <div
            onClick={changeDescriptionActiveHandler}
            className={`${descriptionActive ? 'mb-4' : 'mb-10'} flex items-center cursor-pointer max-w-[max-content]`}
          >
            <IconButton
              type="button"
              icon={
                descriptionActive ? (
                  <DeclineIcon className="fill-accent-white" />
                ) : (
                  <Plus className="fill-accent-white" />
                )
              }
            />
            {!descriptionActive && (
              <p className="font-bold">
                <AppLink color="primary" className="text-main-primary">
                  Add description/purpose
                </AppLink>
              </p>
            )}
          </div>

          {descriptionActive && (
            <div className="mb-10">
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <Input
                    textarea={true}
                    error={errors.description?.message || ''}
                    isSubmitted={isSubmitted}
                    id="description"
                    className="w-full font-medium h-full sm:h-[68px]"
                    label="Contract description"
                    placeholder="Enter contract description"
                    {...field}
                  />
                )}
              />
            </div>
          )}

          <div className="mb-6">
            <Controller
              control={control}
              name="providerId"
              render={({ field }) => (
                <Select
                  addNewInputType="text"
                  error={errors.providerId?.message || ''}
                  label="Select service provider"
                  id="provider"
                  placeholder="Search service provider"
                  className="w-full"
                  startIcon={<SearchIcon />}
                  options={providerList || []}
                  onChangeValue={handleChangeProvider}
                  {...field}
                />
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="w-full">
              <Controller
                control={control}
                name="start_date"
                render={({ field }) => (
                  <DatePickerComponent
                    id="start-date"
                    label="Start date"
                    error={errors.start_date?.message || ''}
                    isSubmitted={isSubmitted}
                    className="w-full font-medium"
                    placeholder="Select start date"
                    startIcon={<CalendarIcon />}
                    minDate={new Date()}
                    setDate={setDate}
                    onChangeValue={handleChangeDate}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="w-full">
              <Controller
                control={control}
                name="end_date"
                render={({ field }) => (
                  <DatePickerComponent
                    id="end-date"
                    label="End date"
                    error={errors.end_date?.message || ''}
                    isSubmitted={isSubmitted}
                    className="w-full font-medium"
                    placeholder="Select end date"
                    startIcon={<CalendarIcon />}
                    minDate={add(date, { days: 1 })}
                    setDate={setDate}
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
