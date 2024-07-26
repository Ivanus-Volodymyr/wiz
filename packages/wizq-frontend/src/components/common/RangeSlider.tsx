import React, { ForwardedRef, useEffect, useState } from 'react';
import RangeSlider from 'react-range-slider-input';
import Input from './Input';
import { useFormContext } from 'react-hook-form';

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  maxValue: number;
  minLabel?: string;
  maxLabel?: string;
  rangeUnit?: string;
  minValue: number;
  value: number[];
  error?: string;
}

const AppRangeSlider = (
  { maxValue, minLabel, maxLabel, rangeUnit, minValue, error, ...props }: Props,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const [sliderValue, setSliderValue] = useState<number[]>(
    (props.value as unknown as number[])?.map((item) => (item * 100) / maxValue) || [1, 100]
  );

  const { setValue } = useFormContext();

  const minValuePercent = () => (minValue * 100) / maxValue;
  const unitPercentage = () => 100 / maxValue;

  function onValueInputBlur() {
    setSliderValue((prevState) => {
      if (prevState[0] <= 0) {
        prevState[0] = unitPercentage();
      }
      if (prevState[1] <= 0) {
        prevState[1] = unitPercentage();
      }
      if (prevState[1] > 100) {
        prevState[1] = 100;
        if (prevState[1] === 100 || prevState[0] === 100) {
          prevState[0] = 100 - unitPercentage();
          prevState[1] = 100;
        }
      }
      if (prevState[0] > prevState[1]) {
        const a = prevState[0];
        prevState[0] = prevState[1];
        prevState[1] = a;
      }
      if (prevState[0] === prevState[1]) {
        prevState[1] = prevState[1] + unitPercentage();
      }
      return [...prevState];
    });
  }

  function handleChange(newValues: number[]) {
    setSliderValue(newValues);
    if (newValues[0] < minValuePercent()) {
      setSliderValue([minValuePercent(), newValues[1]]);
    }
    if (newValues[1] < minValuePercent()) {
      setSliderValue([minValuePercent(), minValuePercent() + unitPercentage()]);
    }
    if (newValues[0] === newValues[1]) {
      if (newValues[1] === 100 || newValues[0] === 100) {
        setSliderValue([100 - unitPercentage(), 100]);
      }
    }
  }

  function inputEnterPressHandler(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.blur();
    }
  }

  function inputChangeHandler(event: React.ChangeEvent<HTMLInputElement>, i: number) {
    let clearValue = event.target.value.replace(/\D/g, '') || 0;
    if (Number(clearValue) > maxValue) {
      clearValue = maxValue;
    }
    setSliderValue((prevState) => {
      prevState[i] = (Number(clearValue) * 100) / maxValue;
      if (prevState[0] === prevState[1]) {
        if (i === 0) {
          prevState[1] = prevState[0] + unitPercentage();
        }
        if (i === 1) {
          prevState[0] = prevState[1] - unitPercentage();
        }
      }
      return [...prevState];
    });
  }

  const minValueInput = ((maxValue * sliderValue[0]) / 100).toLocaleString('en');
  const maxValueInput = ((maxValue * sliderValue[1]) / 100).toLocaleString('en');

  useEffect(() => {
    if (props.name) {
      setValue(
        props.name,
        sliderValue.map((item) => (item * maxValue) / 100),
        { shouldValidate: true }
      );
    }
  }, [maxValue, props.name, setValue, sliderValue]);

  return (
    <div>
      <RangeSlider value={sliderValue} onInput={handleChange} />
      <input type="hidden" ref={ref} />
      <div className="flex justify-between mt-11 gap-4 flex-col lg:flex-row items-center">
        <Input
          className="text-main-primary font-medium"
          value={`${rangeUnit || ''}${minValueInput}` || ''}
          onKeyDown={inputEnterPressHandler}
          onChange={(event) => inputChangeHandler(event as React.ChangeEvent<HTMLInputElement>, 0)}
          onBlur={onValueInputBlur}
          label={minLabel || ''}
        />
        <Input
          className="text-main-primary font-medium"
          value={`${rangeUnit || ''}${maxValueInput}` || ''}
          onKeyDown={inputEnterPressHandler}
          onChange={(event) => inputChangeHandler(event as React.ChangeEvent<HTMLInputElement>, 1)}
          onBlur={onValueInputBlur}
          label={maxLabel || ''}
        />
      </div>
      {error && <p className="text-state-error mb-0">* {error}</p>}
    </div>
  );
};

export default React.forwardRef(AppRangeSlider);
