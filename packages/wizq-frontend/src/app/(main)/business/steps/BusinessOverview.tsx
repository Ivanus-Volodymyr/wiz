'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from '../../../../store';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Business, type BusinessInitialType, type BusinessOverviewType } from '../../../../types/business';
import Input from '../../../../components/common/Input';
import { EmployeeItems } from '../../../../components/business';
import MultiSelect from '../../../../components/common/MultiSelect';
import SearchIcon from '../../../../assets/icons/Icons=Search.svg';
import { BusinessPageProps } from './page';
import { useSetBusinessMutation } from '../../../../store/projects';
import { Option } from '../../../../types';
import Checkbox from '../../../../components/common/Checkbox';

export default function BusinessOverview({ step, setStep, refetch }: BusinessPageProps) {
  const [setBusiness] = useSetBusinessMutation();

  const authInfo = useSelector((state) => state.auth.user);
  const { businesses } = useSelector((state) => state.business);
  const { categories } = useSelector((state) => state.category);

  const [business, setBusinessData] = useState<BusinessInitialType | undefined>(undefined);

  const defaultValues: Business = useMemo(
    () => ({
      name: business?.name && business?.name !== '' ? business?.name : authInfo?.businessName,
      description: business?.description || '',
      categories: [],
      license: business?.license || '',
      employee_cnt: business?.employee_cnt || '',
    }),
    [business, authInfo]
  );

  const schema = yup.object({
    name: yup
      .string()
      .required('This is a required field.')
      .matches(
        /^[A-Z][a-zA-Z0-9~!@#$%^&*()-_=+\/?|{};:'",.<>]/,
        'Please enter a valid name. Valid name includes uppercase and lowercase letters of the alphabet, numeric characters 0 through 9, and the special characters, it must begin with an uppercase  letter of the alphabet.'
      )
      .test('same-name', 'This business name already exists.', (value: string) => {
        const exist = businesses?.find((f) => f.name.trim() === value.trim() && f.authorId !== authInfo?.id);
        return !exist;
      }),
    categories: yup.array().required('This is a required field.').min(1, 'Please select one or more categories'),
    employee_cnt: yup.string().required('Please select at least one option.'),
  });

  const methods = useForm<BusinessOverviewType>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitted },
  } = methods;

  useEffect(() => {
    const findBusiness = businesses?.find((f: BusinessInitialType) => f.authorId === authInfo?.id);
    setBusinessData(findBusiness);
    reset(defaultValues);

    const resCategory = categories?.filter((rs: Option) => {
      return business?.categories?.find((f: Option) => f.categoryId === rs.id);
    });

    setValue('categories', resCategory || []);
  }, [businesses, categories, business]);

  const handleLicenseCheck = () => {
    setValue('license', '');
  };

  const handlerSubmit = async (data: Business) => {
    const resData = (await setBusiness({
      ...data,
      description: data.description.trim(),
      license: data.license.trim(),
      authorId: authInfo?.id,
    })) as { data: undefined };

    if (resData?.data) {
      refetch();
      setStep((preStep) => preStep + 1);
    }
  };

  return (
    <div className="w-full lg:w-[705px] px-7">
      <div className="w-full flex items-center justify-between mb-14">
        <h1 className="text-2xl text-[#0D1835] font-montserrat font-bold leading-[29px]">
          Tell us more about your business
        </h1>
      </div>
      <FormProvider {...methods}>
        <form id={step} onSubmit={handleSubmit(handlerSubmit)}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-3">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  id="business-name"
                  error={errors.name?.message || ''}
                  isSubmitted={isSubmitted}
                  className="w-full font-medium max-w-full"
                  label="Business name"
                  placeholder="E.g. New England Interior design LLC"
                  {...field}
                />
              )}
            />
            <select id="business-llc" className="cursor-pointer text-main-primary font-bold focus:outline-none mt-5">
              <option value="Llc">Llc</option>
            </select>
          </div>
          <div className="mb-3">
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Input
                  textarea={true}
                  id="business-desc"
                  error={errors.description?.message || ''}
                  isSubmitted={isSubmitted}
                  className="w-full font-medium max-w-full"
                  label="Business description"
                  {...field}
                />
              )}
            />
          </div>
          <div className="mb-3">
            <Controller
              control={control}
              name="categories"
              render={({ field }) => (
                <MultiSelect
                  error={errors.categories?.message || ''}
                  label="Your profession category"
                  startIcon={<SearchIcon />}
                  placeholder="Select categories"
                  options={categories || []}
                  {...field}
                />
              )}
            />
          </div>
          <div className="mb-4">
            <Controller
              control={control}
              name="license"
              render={({ field }) => (
                <Input
                  id="license"
                  error={errors.license?.message || ''}
                  isSubmitted={isSubmitted}
                  className="w-full font-medium max-w-full"
                  label="Professional license"
                  placeholder="Input license number"
                  {...field}
                />
              )}
            />
          </div>
          <div className="mb-9 flex items-center justify-end">
            <Checkbox onChange={handleLicenseCheck} checked={!!!watch('license')} label="I am not licensed yet" />
          </div>
          <div>
            <Controller
              control={control}
              name="employee_cnt"
              render={({ field }) => (
                <EmployeeItems
                  error={errors.employee_cnt?.message || ''}
                  isSubmitted={isSubmitted}
                  selectedStatus={business?.employee_cnt || ''}
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
