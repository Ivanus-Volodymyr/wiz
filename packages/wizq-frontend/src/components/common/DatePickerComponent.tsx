import { forwardRef, useState, useEffect } from 'react';
import DatePicker, { type ReactDatePickerProps } from 'react-datepicker';
import { useFormContext } from 'react-hook-form';
import { format, add, sub } from 'date-fns';

import 'react-datepicker/dist/react-datepicker.css';
import InfoCircle from '../../assets/icons/Icons=Info-Cirlce.svg';
import SuccessArrow from '../../assets/icons/Icons=Check.svg';

export interface DatePickerProps extends Omit<ReactDatePickerProps, 'onChange'> {
  id?: string;
  className?: string;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  label?: string;
  error?: string;
  isSubmitted?: boolean;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  setDate?: React.Dispatch<React.SetStateAction<Date>>;
  helperMessage?: string;
  onChangeValue?: (input: Date) => void;
}

const DatePickerComponent = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      id,
      className,
      startIcon,
      endIcon,
      label,
      error,
      isSubmitted,
      placeholder,
      minDate,
      maxDate,
      setDate,
      helperMessage,
      onChangeValue,
      ...props
    },
    ref
  ) => {
    const { setValue } = useFormContext();
    const [selectDate, setSelectDate] = useState<Date>(null);
    const [inputValue, setInputValue] = useState<string>('');

    useEffect(() => {
      if (props.value !== '') {
        const date = new Date(props.value as string);

        if (format(date, 'yyyy-MM-dd') === props.value) {
          setSelectDate(date);
        } else if (date > new Date(props.value as string)) {
          setSelectDate(sub(date, { days: 1 }));
        } else {
          setSelectDate(add(date, { days: 1 }));
        }

        setInputValue(props.value as string);
      }
    }, [props.value]);

    const handleChange = (date: Date) => {
      if (props.name) {
        setValue(props.name, format(date, 'yyyy-MM-dd'), { shouldValidate: true });
      }

      if (onChangeValue) onChangeValue(date);
    };

    return (
      <DatePicker
        {...props}
        onChange={handleChange}
        selected={selectDate}
        placeholderText={placeholder}
        {...(minDate ? { minDate } : {})}
        {...(maxDate ? { maxDate } : {})}
        customInput={
          <div className="w-full relative">
            {label && (
              <label className="font-bold" htmlFor={id}>
                {label}
              </label>
            )}

            <div className="max-w-[100%] w-full relative">
              {startIcon && <span className="absolute top-1/2 left-4 translate-y-[-50%] mt-1">{startIcon}</span>}

              <input
                value={inputValue}
                className={`mt-2 border-2 ${
                  error ? 'border-state-error focus:border-state-error' : ''
                } border-label-disableBG py-5 px-4 ${startIcon ? 'pl-12' : 'pl-4'} pr-16 ${
                  className || ''
                } focus:outline-none focus:border-main-primary placeholder:text-label-disable`}
                placeholder={placeholder}
                readOnly
              />

              {isSubmitted && (
                <span className="absolute top-1/2 right-4 translate-y-[-50%]">
                  {error ? (
                    <InfoCircle className="fill-state-error" />
                  ) : (
                    <SuccessArrow className="fill-state-success" />
                  )}
                </span>
              )}

              {endIcon && <span className="absolute top-1/2 right-4 translate-y-[-50%]">{endIcon}</span>}
            </div>

            {error ? <p className="text-state-error mb-0">* {error}</p> : <p className="mb-0">&nbsp;</p>}

            {helperMessage && (
              <div className="flex gap-2 items-center">
                <div>
                  <InfoCircle className="fill-main-primary" />
                </div>
                <p className="text-label-disable text-sm">{helperMessage}</p>
              </div>
            )}
          </div>
        }
      />
    );
  }
);

DatePickerComponent.displayName = 'DatePickerComponent';
export default DatePickerComponent;
