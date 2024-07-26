'use client';

import React, { useEffect, useState } from 'react';

import { Controller, FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useGeolocated } from 'react-geolocated';

import { useSelector } from '../../../../store';
import { useSetBusinessMutation } from '../../../../store/projects';
import { BusinessPageProps } from './page';
import { ALL_CITIES } from '../../../../utils/location';
import { Business, BusinessInitialType } from '../../../../types/business';
import MultiSelect from '../../../../components/common/MultiSelect';
import { GoogleMapComponent } from '../../../../components/business';
import { type TypePosition } from '../../../../components/business/GoogleMapComponent';
import { Option } from '../../../../types';

import SearchIcon from '../../../../assets/icons/Icons=Search.svg';
import MapIcon from '../../../../assets/icons/Icons=Map_1.svg';
import { errorToast } from '../../../../lib/toast';

export default function BusinessReach({ step, setStep, refetch }: BusinessPageProps) {
  const authInfo = useSelector((state) => state.auth.user);
  const { businesses } = useSelector((state) => state.business);
  const [setBusiness] = useSetBusinessMutation();

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });

  const [business, setBusinessData] = useState<BusinessInitialType | undefined>(undefined);
  const [mapResult, setMapResult] = useState<Option[]>([]);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [center, setCenter] = useState<TypePosition>({
    lat: 40.7569545,
    lng: -73.990494,
  });

  const schema = yup.object({
    like_location: yup
      .array()
      .required('Please enter at least one county that you offer your services in.')
      .min(1, 'Please enter at least one county that you offer your services in.'),
  });

  const methods = useForm<Business>({
    defaultValues: {
      like_location: [],
    },
    resolver: yupResolver(schema),
  });

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = methods;

  useEffect(() => {
    let tmpStr = '';

    if (mapResult.length !== 0) {
      clearErrors();

      const filterData = mapResult?.filter((rs: Option) => {
        if (tmpStr.search(rs.id) === -1) {
          tmpStr += rs.id + ',';

          return rs;
        }
      });

      const resData = filterData.map((rs: Option) => {
        return {
          id: rs.id,
          name: rs.name.split('-')[0],
        };
      });

      setValue('like_location', resData || []);
    } else {
      setValue('like_location', []);
    }
  }, [mapResult, setMapResult]);

  useEffect(() => {
    const findBusiness = businesses?.find((f: BusinessInitialType) => f.authorId === authInfo?.id);
    setBusinessData(findBusiness);

    const cities = business?.like_location !== '' ? business?.like_location?.split(',') : [];

    const likeLocation: Option[] = ALL_CITIES?.filter((rs: Option) => {
      return cities?.find((f: string) => f === rs.id);
    });

    setValue('like_location', likeLocation);
  }, [business, businesses]);

  useEffect(() => {
    if (!isGeolocationAvailable) {
      errorToast('Your browser does not support Geolocation');
      return;
    }

    if (!isGeolocationEnabled) {
      errorToast('Geolocation is not enabled');
      return;
    }

    if (coords) {
      setCenter({
        lat: coords?.latitude,
        lng: coords?.longitude,
      });
    }
  }, [coords, isGeolocationAvailable, isGeolocationEnabled]);

  const handleSkip = () => {
    setStep((preStep) => preStep + 1);
  };

  const handleMap = () => {
    setShowMap(!showMap);
  };

  const handlerSubmit = async (data: Business) => {
    const location = data.like_location.map((rs: Option) => rs.id);
    const resData = (await setBusiness({
      ...data,
      like_location: location as unknown as Option[],
      authorId: authInfo?.id,
    })) as { data: undefined };

    if (resData?.data) {
      refetch();
      setStep((preStep) => preStep + 1);
    }
  };

  return (
    <>
      <div className="w-full lg:w-[705px] px-7">
        <div className="w-full flex flex-col sm:flex-row gap-4 justify-between mb-14">
          <h1 className="text-2xl text-[#0D1835] font-montserrat font-bold leading-[29px]">
            Where would you like to work?
          </h1>
          <p className="mb-0 text-4 text-[#017EFF] font-bold cursor-pointer" onClick={handleSkip}>
            Skip
          </p>
        </div>
        <FormProvider {...methods}>
          <form id={step} onSubmit={handleSubmit(handlerSubmit)}>
            <div className="flex flex-col md:flex-row items-start justify-between gap-10">
              <div className="w-full md:w-[75%]">
                <Controller
                  control={control}
                  name="like_location"
                  render={({ field }) => (
                    <>
                      <MultiSelect
                        error={errors.like_location?.message || ''}
                        startIcon={<SearchIcon />}
                        placeholder="Search cities, neighbourhoods, etc."
                        options={ALL_CITIES || []}
                        suggested={<p className="text-base text-[#017EFF]">Suggested locations</p>}
                        {...field}
                      />
                    </>
                  )}
                />
              </div>
              <div className="flex items-center mt-0 md:mt-7 cursor-pointer" onClick={handleMap}>
                <MapIcon />
                <p className="text-4 text-[#017EFF] font-bold ml-2 mb-0">{showMap ? 'Hide map' : 'Show map'}</p>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
      <GoogleMapComponent
        showMap={showMap}
        center={center}
        setCenter={setCenter}
        coords={coords}
        isGeolocationAvailable={isGeolocationAvailable}
        isGeolocationEnabled={isGeolocationEnabled}
        setMapResult={setMapResult}
      />
    </>
  );
}
