import React, { ForwardedRef, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  startIcon?: JSX.Element;
  label?: string;
  valueText?: string;
  error?: string;
  value: boolean;
}

const ToggleRounded = React.forwardRef(
  ({ startIcon, label, valueText, error, ...props }: Props, ref: ForwardedRef<HTMLInputElement>) => {
    const [checked, setChecked] = useState<boolean>((props.value as unknown as boolean) || false);
    const { setValue } = useFormContext();

    function changeCheckedHandler(event: React.ChangeEvent<HTMLInputElement>) {
      if (props.name) {
        setValue(props.name, event.target.checked, { shouldValidate: true });
        if (props.onChange) {
          props.onChange(event);
        }
      }
    }

    useEffect(() => {
      setChecked(props.value as unknown as boolean);
    }, [props.value]);

    return (
      <div>
        <div className="flex gap-8 items-center">
          <div className="flex gap-2 font-bold items-center">
            {startIcon && startIcon}
            <label>{label}</label>
          </div>
          <div className="flex items-center">
            <input
              ref={ref}
              checked={checked}
              onChange={changeCheckedHandler}
              type="checkbox"
              id="toggle"
              className="hidden"
            />
            <label htmlFor="toggle" className="flex items-center cursor-pointer">
              <div className="relative">
                <div className={`${checked ? 'bg-main-primary' : 'bg-[#CDD6EC]'} block w-12 h-6 rounded-full`}></div>
                <div
                  className={`${checked ? 'right-1' : 'left-1'} dot absolute top-1 bg-[#FFF] w-4 h-4 rounded-full`}
                ></div>
              </div>
            </label>
          </div>
        </div>
        {valueText && <p className="text-label-disable mt-4 font-medium text-sm">{valueText}</p>}
        {error && <p className="text-state-error">* {error}</p>}
      </div>
    );
  }
);

ToggleRounded.displayName = 'ToggleRounded';
export default ToggleRounded;
