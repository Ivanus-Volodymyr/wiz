import React from 'react';
import CheckIcon from '../../assets/icons/Icons=Check.svg';
import { type FieldValues, type UseFormSetValue } from 'react-hook-form';

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'className'> {
  label: string;
  error?: string;
  defaultChecked?: boolean;
  setValue?: UseFormSetValue<FieldValues>;
  className?: string;
}

const Checkbox = ({ error, label, setValue, className, ...props }: Props, ref: React.LegacyRef<HTMLInputElement>) => {
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) props.onChange(e);
    if (setValue && props.name) {
      setValue(props.name, e.target.checked, { shouldValidate: true });
    }
  };

  return (
    <>
      <div className="flex gap-2 items-center">
        <input ref={ref} className="hidden" id="checkbox" type="checkbox" onChange={changeHandler} {...props} />
        <label htmlFor="checkbox" className="flex items-center cursor-pointer">
          <div
            className={`relative overflow-hidden w-[18px] h-[18px] ${
              error ? 'border-bg-[#ED4756]' : 'border-main-secondary'
            } ${props.checked ? 'border-0 bg-state-success' : 'border-[1px]'}`}
          >
            {props.checked && <CheckIcon className="fill-accent-white absolute -left-[3px] -bottom-[3px]" />}
          </div>
        </label>
        <label htmlFor="checkbox" className="cursor-pointer">
          <span className={`text-sm text-[#0D1835] font-bold ${className || ''}`}>{label}</span>
        </label>
      </div>
      {error && <p className="text-state-error">* {error}</p>}
    </>
  );
};

export default React.forwardRef(Checkbox);
