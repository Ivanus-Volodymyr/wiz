'use client';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React, { type ChangeEvent, ReactNode, useState } from 'react';
import { type FieldErrors } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

interface Props {
  value: string;
  type?: HTMLInputElement['type'];
  name: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
  errors?: FieldErrors;
}

const Input = ({ value, type = 'text', name, placeholder, onChange, children, errors }: Props) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  return (
    <>
      <div className="border-state-active-fill border relative">
        <input
          className={`h-[52px] ${children ? 'pl-11' : 'pl-4'} pr-4 w-full block`}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          name={name}
          type={type === 'password' && isPasswordVisible ? 'text' : type}
        />
        {!!children && <div className="absolute h-full flex items-center top-0 left-4">{children}</div>}
        {type === 'password' && (
          <div
            className="absolute h-full flex items-center top-0 right-4 cursor-pointer"
            onClick={() => setIsPasswordVisible((v) => !v)}
          >
            {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
          </div>
        )}
      </div>

      {errors[`${name}`] ? (
        <p className="text-state-error text-sm mb-0 leading-4 whitespace-pre-line mt-2 min-h-[32px]">
          * <ErrorMessage errors={errors} name={name} />
        </p>
      ) : (
        <p className="mb-0 h-8 mt-2">&nbsp;</p>
      )}
    </>
  );
};

export default Input;
