import React, { ForwardedRef, useEffect, useState } from 'react';
import Input from '../../../../../../components/common/Input';
import { LENGTH_UNITS } from '../../../../../../utils/createProject';
import { useFormContext } from 'react-hook-form';
import { Dimensions } from '../../../../../../types/project';

type DimensionsData = {
  length: number | string;
  width: number | string;
};

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  error: string;
  value: Dimensions;
}

const DimensionsInput = React.forwardRef(({ error, ...props }: Props, ref: ForwardedRef<HTMLInputElement>) => {
  const [calculatedArea, setCalculatedArea] = useState<number>(props.value.result);
  const [dimensionsData, setDimensionsData] = useState<DimensionsData>({
    length: props.value.length ? props.value.length.toString() : '',
    width: props.value.width ? props.value.width.toString() : '',
  });
  const [selectedUnit, setSelectedUnit] = useState<number>(props.value.unit);
  const [inputChanged, setInputChanged] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { setValue } = useFormContext();

  function changeDimensionsWidthHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setInputChanged(true);
    const newValue = event.target.value || '0';
    setDimensionsData((prevState) => ({
      ...prevState,
      width: newValue,
    }));
  }

  function changeDimensionsLengthHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setInputChanged(true);
    const newValue = event.target.value || '0';
    setDimensionsData((prevState) => ({
      ...prevState,
      length: newValue,
    }));
    setErr(null);
  }

  function changeSelectedUnitHandler(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedUnit(parseFloat(event.target.value));
  }

  const calculatedValue = Number(dimensionsData.width) * Number(dimensionsData.length) * Math.pow(selectedUnit, 2);

  useEffect(() => {
    if (inputChanged || (dimensionsData.length && dimensionsData.width)) {
      setValue(
        'dimensions',
        {
          length: dimensionsData.length,
          width: dimensionsData.width,
          unit: selectedUnit,
          result: calculatedValue.toFixed(3),
        },
        { shouldValidate: true }
      );
    }
    setCalculatedArea(props.value.result);
  }, [
    calculatedValue,
    dimensionsData.length,
    dimensionsData.width,
    inputChanged,
    props.value.result,
    selectedUnit,
    setValue,
  ]);

  useEffect(() => {
    if (error && (!Number(dimensionsData.length) || !Number(dimensionsData.width)))
      setErr('Please enter both length and width to calculate the square feet of the space');
    if (error && !Number(dimensionsData.length) && !Number(dimensionsData.width))
      setErr('Please enter the square feet of your project');
    if (Number(dimensionsData.length) && Number(dimensionsData.width)) setErr(null);
  }, [error, dimensionsData.width, dimensionsData.length]);

  return (
    <>
      <label className="font-bold">What are the dimensions?</label>
      <div className="flex flex-col lg:flex-row items-center gap-3 mb-3">
        <input type="hidden" ref={ref} />
        <Input
          className={`${
            error && Number(dimensionsData.length) === 0 ? 'border-state-error focus:border-state-error' : ''
          } text-sm w-full`}
          value={dimensionsData.length || ''}
          onChange={changeDimensionsLengthHandler}
          placeholder="LENGTH"
          number={true}
        />
        <span className="text-label-disable font-bold mt-[-15px]">X</span>
        <Input
          className={`${
            error && Number(dimensionsData.width) === 0 ? 'border-state-error focus:border-state-error' : ''
          } text-sm w-full`}
          value={dimensionsData.width || ''}
          onChange={changeDimensionsWidthHandler}
          placeholder="WIDTH"
          number={true}
        />
        <select
          className="cursor-pointer text-main-primary font-bold focus:outline-none mb-6"
          onChange={changeSelectedUnitHandler}
          value={selectedUnit}
        >
          {LENGTH_UNITS.map((item) => (
            <option key={item.name} value={item.value}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <label className="font-bold">
        Area: {calculatedArea} ft<sup>2</sup>
      </label>
      {err ? <p className="text-state-error">* {err}</p> : <p className="text-state-error">&nbsp;</p>}
    </>
  );
});

DimensionsInput.displayName = 'DimensionsInput';
export default DimensionsInput;
