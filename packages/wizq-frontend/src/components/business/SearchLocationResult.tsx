import React, { useState, useEffect } from 'react';
import { Option } from '../../types';

import GpsIcon1 from '../../assets/icons/Icons=Gps_1.svg';
import CloseIcon from '../../assets/icons/Icons=Close_1.svg';

interface SearchLocationResultProps {
  searchResult: google.maps.GeocoderResult[][];
  setMapResult: React.Dispatch<React.SetStateAction<Option[]>>;
  data: Option[];
  setData: React.Dispatch<React.SetStateAction<Option[]>>;
  setShowResult: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SearchLocationResult({
  searchResult,
  setMapResult,
  data,
  setData,
  setShowResult,
}: SearchLocationResultProps) {
  useEffect(() => {
    setMapResult(data);
  }, [data, setData]);

  const contents = (res: google.maps.GeocoderResult[]) => {
    let find = res.find((f: google.maps.GeocoderResult) => f.types[0] === 'locality');

    if (!find) {
      find = res.find((f: google.maps.GeocoderResult) => f.types[0] === 'administrative_area_level_2');
    }

    const tmpRes = res.find((f: google.maps.GeocoderResult) => f.types[0] === 'administrative_area_level_1');
    const result = tmpRes?.address_components?.find((f) => f.types[0] === 'administrative_area_level_1');

    return (
      <>
        <div className="w-4">
          <input
            className="w-4 h-4 border-label-disableBG rounded-none"
            type="checkbox"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleCheck(e, result?.short_name, result?.long_name, find?.formatted_address)
            }
          />
        </div>
        <p className="mb-0 text-[16px] text-[#0D1835] font-normal">{find?.formatted_address}</p>
      </>
    );
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, id: string, name: string, address: string) => {
    if (e.target.checked) {
      setData((preData) => [...preData, { id, name: `${name}-${address}` }]);
    } else {
      const filter = data.filter((rs: Option) => rs.name !== `${name}-${address}`);
      setData(filter);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="px-4 py-[11px] border-b border-[#CDD6EC] relative">
        <p className="text-[18px] text-[#0D1835] mb-1 font-medium">Draw Tool</p>
        <p className="text-[14px] text-[#0D1835] mb-0">Find areas within your selection</p>
        <div className="absolute right-2 top-2 cursor-pointer" onClick={() => setShowResult(false)}>
          <CloseIcon />
        </div>
      </div>

      {searchResult.length === 0 && (
        <div className="w-full flex flex-col items-center justify-center h-[350px] px-10">
          <GpsIcon1 />
          <p className="mt-2 text-[14px] text-[#788398] text-center">Make a selection on the map to view areas</p>
        </div>
      )}

      {searchResult.length !== 0 && (
        <div className="w-full h-[350px] px-4 pt-4 overflow-y-auto">
          {searchResult?.map((res: google.maps.GeocoderResult[], key: number) => (
            <div className="flex mb-6 gap-2 items-center" key={key}>
              <>{contents(res)}</>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
