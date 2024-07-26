import React, { useEffect, useState } from 'react';
import { useSelector } from '../../../../store';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Business, type BusinessInitialType } from '../../../../types/business';
import { BusinessPageProps } from './page';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useSetBusinessMutation } from '../../../../store/projects';
import Input from '../../../../components/common/Input';
import { AttachMoney } from '@mui/icons-material';
import { UsdStartInputIcon } from '../../../../components/contracts';

export default function BusinessHourlyRate({ step, setStep, refetch }: BusinessPageProps) {
  const authInfo = useSelector((state) => state.auth.user);
  const { businesses } = useSelector((state) => state.business);
  const [setBusiness] = useSetBusinessMutation();

  const [business, setBusinessData] = useState<BusinessInitialType | undefined>(undefined);

  const schema = yup.object({
    hourly_rate: yup
      .string()
      .required('This is a required field.')
      .test('', 'Please enter a value greater than 0.', (value: string, context: yup.TestContext<yup.AnyObject>) => {
        if (parseFloat(value) <= 0) {
          return false;
        }

        return true;
      }),
  });

  const methods = useForm<Business>({
    defaultValues: {
      hourly_rate: '',
    },
    resolver: yupResolver(schema),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitted },
  } = methods;

  useEffect(() => {
    const findBusiness = businesses?.find((f: BusinessInitialType) => f.authorId === authInfo?.id);
    setBusinessData(findBusiness);

    setValue('hourly_rate', business?.hourly_rate || '');
  }, [business, businesses]);

  const handlerSkip = () => {
    setStep((preStep) => preStep + 1);
  };

  const handlerSubmit = async (data: Business) => {
    const resData = (await setBusiness({ ...data, authorId: authInfo?.id })) as { data: undefined };

    if (resData?.data) {
      refetch();
      setStep((preStep) => preStep + 1);
    }
  };

  return (
    <div className="w-full lg:w-[705px] px-7">
      <div className="w-full flex flex-col sm:flex-row gap-4 justify-between mb-14">
        <div>
          <h1 className="text-2xl text-[#0D1835] font-montserrat font-bold mb-2 leading-[29px]">
            How much do you want to earn?
          </h1>
          <p className="mb-0 text-base text-[#0D1835]">
            Set your hourly rate, this would be the amount you earn per hour. <br></br>You can change this amount at any
            time.
          </p>
        </div>
        <p className="mb-0 text-4 text-[#017EFF] font-bold cursor-pointer" onClick={handlerSkip}>
          Skip
        </p>
      </div>
      <FormProvider {...methods}>
        <form id={step} onSubmit={handleSubmit(handlerSubmit)}>
          <div className="flex items-center justify-between gap-3">
            <Controller
              control={control}
              name="hourly_rate"
              render={({ field }) => (
                <Input
                  id="hourly-rate"
                  error={errors.hourly_rate?.message || ''}
                  isSubmitted={isSubmitted}
                  className="w-full font-medium max-w-full !pl-14"
                  label="Hourly rate"
                  startIcon={<UsdStartInputIcon />}
                  number={true}
                  helperMessage="Integer and floating numbers greater than 0 can be entered in the field."
                  limit={2000000}
                  {...field}
                />
              )}
            />
            <p className="text-4 text-[#788398] font-medium mb-0 mt-2">/hr</p>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
