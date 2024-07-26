'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from '../../../../store';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Business, type BusinessInitialType, type BusinessLocationType } from '../../../../types/business';
import { BusinessPageProps } from './page';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import Select from '../../../../components/common/Select';
import Input from '../../../../components/common/Input';
import {
  COUNTRIES,
  US_STATES,
  US_CITIES,
  CA_STATES,
  CA_CITIES,
  ALL_US_CITIES,
  ALL_CA_CITIES,
} from '../../../../utils/location';
import { useSetBusinessMutation } from '../../../../store/projects';
import { Option } from '../../../../types';

export default function BusinessLocation({ step, setStep, refetch }: BusinessPageProps) {
  const authInfo = useSelector((state) => state.auth.user);
  const { businesses } = useSelector((state) => state.business);
  const [setBusiness] = useSetBusinessMutation();

  const [addressOptions, setAddressOptions] = useState<string[]>([]);
  const [state, setState] = useState<string[]>(US_STATES);
  const [city, setCity] = useState<string[]>(US_CITIES);
  const [business, setBusinessData] = useState<BusinessInitialType | undefined>(undefined);

  const defaultValues: Business = useMemo(
    () => ({
      country: '',
      state: business?.location?.[0]?.state || '',
      address: business?.location?.[0]?.address || '',
      city: business?.location?.[0]?.city || '',
      zipcode: business?.location?.[0]?.zipcode || '',
    }),
    [business]
  );

  const schema = yup.object({
    country: yup.string().required('This is a required field.'),
    state: yup.string().required('This is a required field.'),
    address: yup.string().required('Please enter a valid address.'),
    city: yup.string().required('This is a required field.'),
    zipcode: yup
      .string()
      .required('This is a required field.')
      .when('country', {
        is: 'United States',
        then: (obj) => obj.matches(/\b\d{5}(?:-\d{4})?\b/, 'Please enter a valid zipcode.'),
        otherwise: (obj) => obj.min(0),
      })
      .when('country', {
        is: 'Canada',
        then: (obj) => obj.matches(/\b[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d\b/, 'Please enter a valid zipcode.'),
        otherwise: (obj) => obj.min(0),
      }),
  });

  const methods = useForm<BusinessLocationType>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    clearErrors,
    watch,
    formState: { errors, isSubmitted },
  } = methods;

  useEffect(() => {
    const findBusiness = businesses?.find((f: BusinessInitialType) => f.authorId === authInfo?.id);
    setBusinessData(findBusiness);

    reset(defaultValues);
    const country = COUNTRIES.find((f) => f.split('-')[1] === business?.location?.[0]?.country);

    setValue('country', country?.toString().split('-')[0] || '');
  }, [business, businesses]);

  const clearErrorsHandler = () => {
    clearErrors();
    reset({ ...watch() }, { keepIsSubmitted: false });
  };

  async function changeAddressInputHandler(input: string) {
    if (input === '') {
      setAddressOptions([]);
      return;
    }

    const addresses = await new google.maps.places.AutocompleteService().getPlacePredictions({
      input,
      componentRestrictions: {
        country: ['us', 'ca'],
      },
    });

    setAddressOptions(addresses.predictions.map((item) => item.description));
  }

  const handleChangeCountry = (value: string) => {
    if (value === 'US') {
      const findState = US_STATES.find((rs: string) => rs === business?.location?.[0]?.state);
      const findCity = US_CITIES.find((rs: string) => rs === business?.location?.[0]?.city);

      setState(US_STATES);
      setValue('state', findState || '');

      if (business?.location?.[0]?.address?.search('USA') !== -1) {
        setValue('address', business?.location?.[0]?.address);
      } else {
        setValue('address', '');
      }

      setCity(US_CITIES);
      setValue('city', findCity || '');
      setValue('zipcode', '');
    }

    if (value === 'CA') {
      const findState = CA_STATES.find((rs: string) => rs === business?.location?.[0]?.state);
      const findCity = CA_CITIES.find((rs: string) => rs === business?.location?.[0]?.city);

      setState(CA_STATES);
      setValue('state', findState || '');

      if (business?.location?.[0]?.address?.search('CANADA') !== -1) {
        setValue('address', business?.location?.[0]?.address);
      } else {
        setValue('address', '');
      }

      setCity(CA_CITIES);
      setValue('city', findCity || '');
      setValue('zipcode', '');
    }

    clearErrorsHandler();
  };

  const handleChangeState = (value: string) => {
    const country = getValues('country');
    let find: Option = null;

    if (country === 'United States') {
      find = ALL_US_CITIES.find((rs: Option) => rs.id === value);
    }

    if (country === 'Canada') {
      find = ALL_CA_CITIES.find((rs: Option) => rs.id === value);
    }

    setValue('city', find?.name || '');
    setValue('zipcode', '');
    clearErrorsHandler();
  };

  const handleChangeCity = (value: string) => {
    const country = getValues('country');
    let find: Option = null;

    if (country === 'United States') {
      find = ALL_US_CITIES.find((rs: Option) => rs.name === value);
    }

    if (country === 'Canada') {
      find = ALL_CA_CITIES.find((rs: Option) => rs.name === value);
    }

    setValue('state', find?.id || '');
    setValue('zipcode', '');
    clearErrorsHandler();
  };

  const handleAddress = (address: string) => {
    new google.maps.Geocoder().geocode({ address }, (res, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        const countryData = res?.[0].address_components?.find(
          (rs: google.maps.GeocoderAddressComponent) => rs?.types?.[0] === 'country'
        );

        if (countryData) {
          if (countryData?.short_name === 'US') {
            setState(US_STATES);
            setCity(US_CITIES);
          }

          if (countryData?.short_name === 'CA') {
            setState(CA_STATES);
            setCity(CA_CITIES);
          }
        }

        const stateData = res?.[0].address_components?.find(
          (rs: google.maps.GeocoderAddressComponent) => rs?.types?.[0] === 'administrative_area_level_1'
        );

        const postalCodeData = res?.[0].address_components?.find(
          (rs: google.maps.GeocoderAddressComponent) => rs?.types?.[0] === 'postal_code'
        );

        setValue('country', countryData?.long_name || '');
        setValue('state', stateData?.short_name || '');
        setValue('city', stateData?.long_name || '');
        setValue('zipcode', postalCodeData?.long_name || '');
        clearErrorsHandler();
      }
    });
  };

  const handlerSkip = () => {
    setStep((preStep) => preStep + 1);
  };

  const handlerSubmit = async (data: Business) => {
    const country = COUNTRIES.find((f) => f.split('-')[0] === data.country);
    const resData = (await setBusiness({ ...data, country: country.split('-')[1], authorId: authInfo?.id })) as {
      data: undefined;
    };

    if (resData?.data) {
      refetch();
      setStep((preStep) => preStep + 1);
    }
  };

  return (
    <div className="w-full lg:w-[705px] px-7">
      <div className="w-full flex flex-col sm:flex-row gap-4 justify-between mb-14">
        <h1 className="text-2xl text-[#0D1835] font-montserrat font-bold leading-[29px]">Where are you located?</h1>
        <p className="mb-0 text-4 text-[#017EFF] font-bold cursor-pointer" onClick={handlerSkip}>
          Skip
        </p>
      </div>
      <FormProvider {...methods}>
        <form id={step} onSubmit={handleSubmit(handlerSubmit)}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-3">
            <div className="w-full">
              <Controller
                control={control}
                name="country"
                render={({ field }) => (
                  <Select
                    addNewInputType="text"
                    label="Country or Region"
                    id="country"
                    placeholder="Select country"
                    className="w-full"
                    error={errors.country?.message || ''}
                    options={COUNTRIES}
                    onChangeValue={handleChangeCountry}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="w-full">
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <Select
                    addNewInputType="text"
                    label="State"
                    id="state"
                    placeholder="Select state"
                    className="w-full"
                    error={errors.state?.message || ''}
                    options={state}
                    onChangeValue={handleChangeState}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <div className="mb-3 w-full">
            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <Select
                  error={errors.address?.message || ''}
                  onAddressValidation={changeAddressInputHandler}
                  label="Street address"
                  id="select-location"
                  placeholder="Address line 1"
                  className="w-full"
                  options={addressOptions}
                  onChangeValue={handleAddress}
                  {...field}
                />
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full">
              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <Select
                    addNewInputType="text"
                    label="City"
                    id="city"
                    placeholder="Select city"
                    className="w-full"
                    error={errors.city?.message || ''}
                    options={city}
                    onChangeValue={handleChangeCity}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="w-full">
              <Controller
                control={control}
                name="zipcode"
                render={({ field }) => (
                  <Input
                    id="zipcode"
                    error={errors.zipcode?.message || ''}
                    isSubmitted={isSubmitted}
                    className="w-full font-medium max-w-full"
                    label="Zipcode"
                    placeholder="Enter zipcode"
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
