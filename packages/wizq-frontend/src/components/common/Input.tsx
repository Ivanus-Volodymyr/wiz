import React, { ForwardedRef, useRef } from 'react';
import InfoCircle from '../../assets/icons/Icons=Info-Cirlce.svg';
import SuccessArrow from '../../assets/icons/Icons=Check.svg';
import classNames from 'classnames';

interface Props extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  className?: string;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  helperMessage?: string;
  label?: string;
  error?: string;
  isSubmitted?: boolean;
  textarea?: boolean;
  sortNumber?: number;
  number?: boolean;
  limit?: number;
  onChangeValue?: (input: string, index?: number) => void;
}

const Input = React.forwardRef(
  (
    {
      className,
      startIcon,
      endIcon,
      helperMessage,
      label,
      error,
      isSubmitted,
      textarea,
      sortNumber,
      number,
      limit,
      onChangeValue,
      ...props
    }: Props,
    ref: ForwardedRef<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>();

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (props.onKeyDown) props.onKeyDown(event);

      if (number) {
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', 'Tab'];
        const isDigit = /^[0-9.]*$/.test(event.key);
        const isAllowedKey = allowedKeys.includes(event.key);

        if (!isDigit && !isAllowedKey) event.preventDefault();
      }
    };

    function changeValueHandler(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
      if (number && event.target.value !== '') {
        const isDigit = /^[0-9]+(\.)?(\.[0-9]{1,2})*$/.test(event.target.value);

        if (!isDigit) return;
        if (limit && parseFloat(event.target.value) > limit) return;
        if (event.target.value.toString().length > 10) return;
      }

      if (textarea) {
        const refHeightNumber = parseFloat(textareaRef.current.style.height.replace('px', ''));
        const textareaHeightNumber = event.target.scrollHeight;
        if (refHeightNumber < textareaHeightNumber || textareaRef.current.style.height === '') {
          textareaRef.current.style.height = `${textareaHeightNumber + 4}px`;
        }
      }

      if (props && props?.id === 'zipcode') {
        event.target.value = event.target.value.substring(0, 7);
      }

      if (props && props?.id === 'notice-period' && event.target.value === '0') {
        return;
      }

      if (onChangeValue) onChangeValue(event.target.value, parseInt(props.id.split('-')[1]));

      props.onChange?.(event);
    }

    return (
      <div className="w-full">
        {label && (
          <label className="font-bold" htmlFor={props.id}>
            {label}
          </label>
        )}
        <div className="max-w-[100%] w-full relative">
          {startIcon && <span className="absolute top-1/2 left-4 translate-y-[-50%] mt-1">{startIcon}</span>}

          {sortNumber && (
            <div className="absolute top-1/2 left-4 translate-y-[-50%] mt-1 w-[30px] h-[30px] flex items-center justify-center bg-[#E0ECF8] rounded">
              {sortNumber}
            </div>
          )}

          {textarea ? (
            <textarea
              ref={textareaRef}
              {...props}
              value={props.value}
              onKeyDown={handleKeyPress}
              onChange={changeValueHandler}
              className={classNames({
                'mt-2 border-2 border-label-disableBG py-5 px-4 pr-12 focus:outline-none focus:border-main-primary placeholder:text-label-disable h-[68px] overflow-auto resize-y':
                  true,
                'border-state-error focus:border-state-error pr-12': error,
                'pr-12': isSubmitted,
                'pl-12': startIcon || sortNumber,
                'pr-16': endIcon,
                [className]: className,
              })}
            />
          ) : (
            <input
              ref={ref as React.LegacyRef<HTMLInputElement>}
              {...props}
              value={props.value}
              onKeyDown={handleKeyPress}
              onChange={changeValueHandler}
              {...(number ? { inputMode: 'numeric' } : {})}
              className={classNames({
                'mt-2 border-2 border-label-disableBG py-5 px-4 focus:outline-none focus:border-main-primary placeholder:text-label-disable':
                  true,
                'border-state-error focus:border-state-error pr-12': error,
                'pr-12': isSubmitted,
                'pl-12': startIcon || sortNumber,
                'pr-16': endIcon,
                [className]: className,
              })}
            />
          )}

          <div className="absolute top-1/2 right-4 translate-y-[-50%] flex gap-2 items-center">
            {endIcon && <span>{endIcon}</span>}
            {isSubmitted && (
              <span>
                {error ? <InfoCircle className="fill-state-error" /> : <SuccessArrow className="fill-state-success" />}
              </span>
            )}
          </div>
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
    );
  }
);

Input.displayName = 'Input';

export default Input;
