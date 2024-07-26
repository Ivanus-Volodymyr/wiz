import React, { ForwardedRef, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import classNames from 'classnames';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  options: string[];
  label?: string;
  error?: string;
}

const RadioGroup = React.forwardRef(
  ({ options, label, error, ...props }: Props, ref: ForwardedRef<HTMLInputElement>) => {
    const [selected, setSelected] = useState<string>('');
    const { setValue } = useFormContext();

    useEffect(() => {
      setSelected(props.value as string);
    }, [props.value]);

    const handleSelectItem = (e: any) => {
      if (props.name) {
        setValue(props.name, e.target.id as React.ChangeEvent<HTMLInputElement>, { shouldValidate: true });
      }
    };

    return (
      <>
        <label className="font-bold">{label}</label>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 font-medium">
          {options.map((item) => (
            <div key={item} className="relative">
              <input
                checked={selected === item}
                ref={ref}
                {...props}
                className="scale-[1.5] w-6 cursor-pointer absolute top-1/2 mt-[-5px] left-4"
                onClick={handleSelectItem}
                type="radio"
                value={item}
                id={item}
              />
              <label
                className={classNames({
                  'focus:outline-none flex gap-2 items-center border-2 p-4 cursor-pointer border-fill-border h-full':
                    true,
                  'border-state-error focus:border-state-error': error,
                  'border-main-primary': selected === item,
                })}
                htmlFor={item}
              >
                <p className="pl-7">{item}</p>
              </label>
            </div>
          ))}
        </div>
        {error && <p className="text-state-error">* {error}</p>}
      </>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
export default RadioGroup;
