import React, { useEffect, useState, useRef, HTMLInputTypeAttribute, ForwardedRef } from 'react';
import ChevronDown from '../../assets/icons/Icons=Chevron-Down.svg';
import ChevronUp from '../../assets/icons/Icons=Chevron-Up.svg';
import { useFormContext } from 'react-hook-form';
import InfoCircle from '../../assets/icons/Icons=Info-Cirlce.svg';
import DeclineIcon from '../../assets/icons/Icons=Times.svg';
import IconButton from './IconButton';
import Plus from '../../assets/icons/Icons=Plus.svg';
import SuccessIcon from '../../assets/icons/Icons=Check.svg';
import Input from './Input';
import AppLink from './AppLink';
import CalendarIcon from '../../assets/icons/Icons=Calendar.svg';
import DatePickerComponent from './DatePickerComponent';
import { format, add } from 'date-fns';

interface Props extends React.SelectHTMLAttributes<HTMLInputElement> {
  options: string[];
  startIcon?: JSX.Element;
  className?: string;
  placeholder?: string;
  label?: string;
  error?: string;
  helperMessage?: string;
  onAddNew?: (item: string) => void | Promise<void>;
  addNewText?: string;
  onAddressValidation?: (input: string) => void;
  onChangeValue?: (input: string) => void;
  addNewInputType?: HTMLInputTypeAttribute;
}

const Select = React.forwardRef(
  (
    {
      options,
      startIcon,
      className,
      placeholder,
      error,
      label,
      helperMessage,
      onAddNew,
      addNewText,
      onAddressValidation,
      onChangeValue,
      addNewInputType,
      ...props
    }: Props,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [selectOpen, setSelectOpen] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [searchValue, setSearchValue] = useState<string>('');
    const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
    const [isAddNewActive, setIsAddNewActive] = useState(false);
    const [newItemValue, setNewItemValue] = useState('');
    const [addNewIcon, setAddNewIcon] = useState<JSX.Element>(
      <Plus onClick={() => setSelectOpen(true)} className="fill-accent-white" />
    );
    const [chosenItem, setChosenItem] = useState<string>('');

    const handleChangeDate = (date: Date) => {
      setNewItemValue(format(date, 'yyyy-MM-dd'));
    };

    useEffect(() => {
      setSearchValue(props.value as string);
      setSelectedValue(props.value as string);
    }, [props.value]);

    const { setValue } = useFormContext();

    function clearSelect() {
      setSearchValue('');
      setSelectedValue('');
      setFilteredOptions(options);

      if (props.name) setValue(props.name, '', { shouldValidate: true });
      if (onAddressValidation) onAddressValidation('');
      if (onChangeValue) onChangeValue('clear');
    }

    const listRef = useRef<HTMLUListElement>();
    const scrollSelectToPosition = (position: number) => {
      if (listRef.current) {
        listRef.current.scrollTop = position;
      }
    };

    function searchInputKeyPressHandler(event: React.KeyboardEvent<HTMLInputElement>) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (!selectOpen) {
          setSelectOpen(true);
          return;
        }
        setChosenItem((prevState) => {
          const currentIndex = filteredOptions.findIndex((item) => item === prevState);
          if (currentIndex > -1 && currentIndex < filteredOptions.length - 1) {
            scrollSelectToPosition(currentIndex * 64);
            return filteredOptions[currentIndex + 1];
          }
          return prevState;
        });
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (!selectOpen) {
          setSelectOpen(true);
          return;
        }
        setChosenItem((prevState) => {
          const currentIndex = filteredOptions.findIndex((item) => item === prevState);
          if (currentIndex > 0) {
            scrollSelectToPosition(currentIndex * 64 - 64);
            return filteredOptions[currentIndex - 1];
          }
          return prevState;
        });
      }
      if (event.key === 'Enter') {
        event.preventDefault();

        if (!selectOpen) {
          setSelectOpen(true);
          return;
        }

        if (filteredOptions.length) {
          setSearchValue(chosenItem.split('-')[0]);
          setSelectOpen(false);

          if (props.name) {
            if (chosenItem.search('-') !== -1) {
              setValue(props.name, chosenItem.split('-')[0], { shouldValidate: true });
            } else {
              setValue(props.name, chosenItem, { shouldValidate: true });
            }
          }

          if (chosenItem === props.value) {
            clearSelect();
          }

          if (onChangeValue) {
            const tmpData = chosenItem.split('-');

            if (tmpData.length > 2) {
              let strTmp = '';

              for (let index = 1; index < tmpData.length; index++) {
                strTmp += tmpData[index] + '-';
              }

              onChangeValue(strTmp.slice(0, strTmp.length - 1));
            } else {
              onChangeValue(tmpData[1] ? tmpData[1] : chosenItem);
            }
          }
        }
      }
    }

    function resetAddNewField(value: string) {
      setSelectOpen(false);
      setIsAddNewActive(false);
      setNewItemValue('');
      if (onAddNew) {
        void onAddNew(value);
      }
    }

    function saveNewValueHandler() {
      if (newItemValue) {
        let newValue: string;
        if (addNewInputType === 'date') {
          const newDate = format(add(new Date(newItemValue), { days: 1 }), 'dd/MM/yyyy');

          newValue = newDate;
          if (props.name) {
            setValue(props.name, newDate, { shouldValidate: true });
            setSearchValue(newDate);
          }
        } else {
          if (props.name) {
            if (newItemValue.search('-') !== -1) {
              setValue(props.name, newItemValue.split('-')[0], { shouldValidate: true });
            } else {
              setValue(props.name, newItemValue, { shouldValidate: true });
            }
            setSearchValue(newItemValue.split('-')[0]);
            newValue = newItemValue.split('-')[0];
          }
        }
        resetAddNewField(newValue);
      }
    }

    function addNewValueEnterPressHandler(event: React.KeyboardEvent<HTMLInputElement>) {
      if (event.key === 'Enter') {
        event.preventDefault();
        saveNewValueHandler();
      }
    }

    function changeNewItemValueHandler(event: React.ChangeEvent<HTMLInputElement>) {
      setNewItemValue(event.target.value);
    }

    function changeAddNewActiveHandler() {
      setIsAddNewActive((prevState) => !prevState);
    }

    function selectValueHandler(item: string) {
      setSearchValue(item.split('-')[0]);
      setSelectOpen(false);
      setFilteredOptions(options);

      if (props.name) {
        if (item === selectedValue) {
          if (onAddressValidation) {
            onAddressValidation('');
          }
        } else {
          if (item.search('-') !== -1) {
            setValue(props.name, item.split('-')[0], { shouldValidate: true });
          } else {
            setValue(props.name, item, { shouldValidate: true });
          }
        }
      }

      if (onChangeValue) {
        const tmpData = item.split('-');

        if (tmpData.length > 2) {
          let strTmp = '';

          for (let index = 1; index < tmpData.length; index++) {
            strTmp += tmpData[index] + '-';
          }

          onChangeValue(strTmp.slice(0, strTmp.length - 1));
        } else {
          onChangeValue(tmpData[1] ? tmpData[1] : item);
        }
      }
    }

    function searchOptionsHandler(event: React.ChangeEvent<HTMLInputElement>) {
      setSelectOpen(true);
      setSearchValue(event.target.value.split('-')[0]);
      const newFilteredOptions = options?.filter((item) =>
        item.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setFilteredOptions(newFilteredOptions);
      if (onAddressValidation) {
        onAddressValidation(event.target.value);
      }
      if (newFilteredOptions.length) {
        setChosenItem(newFilteredOptions[0]);
      }
    }

    const dropdownRef = useRef<HTMLDivElement>(document.createElement('div'));

    useEffect(() => {
      const handleOutsideClick = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && selectOpen) {
          setSelectOpen(false);
          if (searchValue !== selectedValue) {
            setSearchValue(selectedValue);
          }
          setFilteredOptions(options);
        }
      };

      document.addEventListener('click', handleOutsideClick);

      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    }, [options, searchValue, selectedValue, selectOpen]);

    useEffect(() => {
      setFilteredOptions(options);
      setSelectedValue(props.value as string);
    }, [options, props.value]);

    useEffect(() => {
      if (isAddNewActive) {
        setAddNewIcon(<DeclineIcon onClick={() => setSelectOpen(true)} className="fill-accent-white" />);
      } else {
        setAddNewIcon(<Plus onClick={() => setSelectOpen(true)} className="fill-accent-white" />);
      }
    }, [isAddNewActive]);

    useEffect(() => {
      if (filteredOptions?.length > 0 && !filteredOptions?.includes(chosenItem)) {
        setChosenItem(filteredOptions[0]);
      }
      if (!filteredOptions?.length) {
        setChosenItem('');
      }
    }, [chosenItem, filteredOptions]);

    return (
      <>
        {label && (
          <label className="font-bold" htmlFor={props.id}>
            {label}
          </label>
        )}
        <div ref={dropdownRef} className="relative max-w-full">
          {startIcon && (
            <span className="absolute top-1/2 left-4 translate-y-[-50%] fill-accent-green mt-1">{startIcon}</span>
          )}

          <input
            ref={ref}
            id={props.id}
            autoComplete="off"
            onClick={() => setSelectOpen((prevState) => !prevState)}
            onKeyDown={searchInputKeyPressHandler}
            placeholder={placeholder}
            value={searchValue}
            onChange={searchOptionsHandler}
            className={`${
              error ? 'border-state-error focus:border-state-error' : ''
            } appearance-none mt-2 w-full border-2 border-label-disableBG py-5 px-4 cursor-pointer ${
              startIcon ? 'pl-12' : 'pl-4'
            } ${
              className || ''
            } pr-16 focus:outline-none focus:border-main-primary placeholder:text-label-disable option:disabled:text-label-disable font-medium ${
              selectOpen ? 'border-main-primary outline-none' : ''
            }`}
          />
          <div className="absolute inset-y-0 right-0 flex items-center px-2 mt-2">
            {searchValue && <DeclineIcon className="fill-main-secondary cursor-pointer m-1" onClick={clearSelect} />}
            <div onClick={() => setSelectOpen((prevState) => !prevState)} className="cursor-pointer">
              {selectOpen ? (
                <ChevronUp className="fill-main-secondary" />
              ) : (
                <ChevronDown className="fill-main-secondary" />
              )}
            </div>
          </div>

          {selectOpen && (
            <ul ref={listRef} className="absolute w-full max-h-[300px] overflow-y-scroll  border-t-0 shadow-lg  z-10">
              {filteredOptions?.map((item) => (
                <li
                  onMouseEnter={() => setChosenItem(item)}
                  onClick={() => selectValueHandler(item)}
                  className={`cursor-pointer py-5 px-4 ${
                    chosenItem === item ? 'bg-main-primary text-accent-white' : ''
                  }  ${
                    selectedValue === item.split('-')[0]
                      ? 'bg-state-activeFill hover:bg-state-activeFill'
                      : 'bg-accent-white'
                  }`}
                  key={item}
                >
                  {item.split('-')[0]}
                </li>
              ))}

              {onAddNew && (
                <li className="bg-accent-white p-2 flex items-center">
                  <div
                    onClick={!isAddNewActive ? changeAddNewActiveHandler : undefined}
                    className={`flex items-center ${!isAddNewActive ? 'cursor-pointer' : ''}`}
                  >
                    <IconButton
                      onClick={isAddNewActive ? changeAddNewActiveHandler : undefined}
                      type="button"
                      icon={addNewIcon}
                    />
                    <AppLink color="primary" className={`font-bold ${isAddNewActive ? 'hidden' : ''}`}>
                      {addNewText}
                    </AppLink>
                  </div>

                  {isAddNewActive && (
                    <>
                      <div className="w-full">
                        {addNewInputType === 'date' ? (
                          <DatePickerComponent
                            shouldCloseOnSelect={false}
                            id="start-date"
                            popperPlacement="top-start"
                            className="w-full font-medium"
                            placeholder="Select start date"
                            startIcon={<CalendarIcon />}
                            value={newItemValue}
                            minDate={new Date()}
                            onChangeValue={handleChangeDate}
                          />
                        ) : (
                          <Input
                            type={addNewInputType || 'text'}
                            min="1000-01-01"
                            max="9999-12-31"
                            className="w-full cursor-text"
                            value={newItemValue}
                            onChange={changeNewItemValueHandler}
                            onKeyDown={addNewValueEnterPressHandler}
                          />
                        )}
                      </div>
                      <IconButton
                        className="ml-4 mr-0"
                        type="button"
                        onClick={saveNewValueHandler}
                        icon={<SuccessIcon className="fill-accent-white" />}
                      />
                    </>
                  )}
                </li>
              )}
            </ul>
          )}
        </div>

        {error ? <p className="text-state-error mb-0">* {error}</p> : <p className="mb-0">&nbsp;</p>}

        {helperMessage && (
          <div className="flex gap-2 items-center mt-3">
            <div>
              <InfoCircle className="fill-main-primary" />
            </div>
            <p className="text-label-disable text-sm">{helperMessage}</p>
          </div>
        )}
      </>
    );
  }
);

Select.displayName = 'Select';
export default Select;
