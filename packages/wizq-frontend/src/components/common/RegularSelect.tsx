import React, { useEffect, useRef, useState } from 'react';
import ChevronUp from '../../assets/icons/Icons=Chevron-Up.svg';
import ChevronDown from '../../assets/icons/Icons=Chevron-Down.svg';
import { type FieldValues, type UseFormSetValue } from 'react-hook-form';

type Option = {
  id?: string;
  name: string;
  value: any;
  icon?: JSX.Element;
};

interface Props extends Omit<React.SelectHTMLAttributes<HTMLInputElement>, 'value'> {
  options: Option[];
  value: Option;
  setValue?: UseFormSetValue<FieldValues>;
  onSelectValue?: (value: Option['value']) => void;
}

const RegularSelect = ({ options, value, setValue, onSelectValue, ...props }: Props, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  const changeOpenHandler = () => {
    setIsOpen((prevState) => !prevState);
  };

  const selectValueHandler = (optionValue: Option['value']) => {
    if (onSelectValue) {
      onSelectValue(optionValue);
    }
    if (props.name && setValue) {
      setValue(props.name, optionValue, { shouldValidate: true });
    }
    setIsOpen(false);
  };

  const dropdownRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (isOpen) {
      const handleOutsideClick = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && isOpen === true) {
          setIsOpen(false);
        }
      };

      document.addEventListener('click', handleOutsideClick);

      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <div onClick={changeOpenHandler} className="flex cursor-pointer gap-2 items-center">
        {value.icon && <div>{value.icon}</div>}
        <p className="text-main-primary font-bold">{value.name}</p>
        <div>
          {isOpen ? <ChevronUp className="fill-main-primary" /> : <ChevronDown className="fill-main-primary" />}
        </div>
      </div>
      {isOpen && (
        <ul className="absolute w-full max-h-[300px] border-t-0 shadow-lg cursor-pointer z-10 text-center">
          {options.map((item) => (
            <li
              className={`cursor-pointer py-5 px-4 hover:bg-main-primary hover:text-accent-white ${
                value.value === item.value ? 'bg-state-activeFill hover:bg-state-activeFill' : 'bg-accent-white'
              }`}
              key={item.name}
              onClick={() => selectValueHandler(item.value)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default React.forwardRef(RegularSelect);
