import React, { useEffect, useState } from 'react';
import { useSelector } from '../../../../store';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Business, type BusinessInitialType, type BusinessServicesType } from '../../../../types/business';
import { BusinessPageProps } from './page';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useCreateSuggestedServicesMutation, useSetBusinessMutation } from '../../../../store/projects';
import MultiSelect from '../../../../components/common/MultiSelect';
import SearchIcon from '../../../../assets/icons/Icons=Search.svg';
import { Option } from '../../../../types';

export default function BusinessService({ step, setStep, refetch }: BusinessPageProps) {
  const [setBusiness] = useSetBusinessMutation();
  const [getSuggestedServices] = useCreateSuggestedServicesMutation();

  const authInfo = useSelector((state) => state.auth.user);
  const { businesses, suggestedServices } = useSelector((state) => state.business);
  const { services } = useSelector((state) => state.service);

  const [business, setBusinessData] = useState<BusinessInitialType | undefined>(undefined);

  const schema = yup.object({
    services: yup.array().required('This is a required field.').min(1, 'Please select one or more services.'),
  });

  const methods = useForm<BusinessServicesType>({
    defaultValues: {
      services: [],
    },
    resolver: yupResolver(schema),
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  useEffect(() => {
    const findBusiness = businesses?.find((f: BusinessInitialType) => f.authorId === authInfo?.id);
    setBusinessData(findBusiness);

    const resService = services?.filter((rs) => {
      return business?.services?.find((f: Option) => f.serviceId === rs.id);
    });

    setValue('services', resService || []);
  }, [business, services, businesses]);

  const handlerSubmit = async (data: Business) => {
    const resData = (await setBusiness({ ...data, authorId: authInfo?.id })) as { data: undefined };

    if (resData?.data) {
      refetch();
      setStep((preStep) => preStep + 1);
    }
  };

  const selectedServices = watch('services');

  useEffect(() => {
    if (selectedServices) {
      void getSuggestedServices(selectedServices.map((item) => item.name));
    }
  }, [getSuggestedServices, selectedServices.length]);

  return (
    <div className="w-full lg:w-[705px] px-3 sm:px-7">
      <div className="w-full flex items-center justify-between mb-14">
        <h1 className="text-2xl text-[#0D1835] font-montserrat font-bold leading-[29px]">
          What services do you provide?
        </h1>
      </div>
      <FormProvider {...methods}>
        <form id={step} onSubmit={handleSubmit(handlerSubmit)}>
          <Controller
            control={control}
            name="services"
            render={({ field }) => (
              <MultiSelect
                error={errors.services?.message || ''}
                label="Services"
                startIcon={<SearchIcon />}
                placeholder="Search services"
                options={services || []}
                suggested={<p className="text-base text-[#017EFF]">Suggested services</p>}
                suggestedOptions={suggestedServices || []}
                {...field}
              />
            )}
          />
        </form>
      </FormProvider>
    </div>
  );
}
