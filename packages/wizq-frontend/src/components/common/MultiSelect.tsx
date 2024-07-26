import React, { ForwardedRef, useCallback, useEffect, useRef, useState } from 'react';
import ChevronUp from '../../assets/icons/Icons=Chevron-Up.svg';
import ChevronDown from '../../assets/icons/Icons=Chevron-Down.svg';
import DeclineIcon from '../../assets/icons/Icons=Times.svg';
import PlusIcon from '../../assets/icons/Icons=Plus.svg';
import { useFormContext } from 'react-hook-form';

interface Props<T extends { id: string; name: string }>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  options: Pick<T, 'id' | 'name'>[];
  startIcon?: JSX.Element;
  className?: string;
  placeholder?: string;
  label?: string;
  error?: string;
  suggested?: React.ReactNode;
  value: Pick<T, 'id' | 'name'>[];
  disabled?: boolean;
  suggestedOptions?: Pick<T, 'id' | 'name'>[];
}

const MultiSelect = <T extends { id: string; name: string }>(
  {
    options,
    startIcon,
    className,
    placeholder,
    label,
    error,
    suggested,
    disabled,
    suggestedOptions,
    ...props
  }: Props<T>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const [filteredOptions, setFilteredOptions] = useState<Pick<T, 'id' | 'name'>[]>(options);
  const [selectOpen, setSelectOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedValues, setSelectedValues] = useState<Pick<T, 'id' | 'name'>[]>(
    (props.value as unknown as Pick<T, 'id' | 'name'>[]) || []
  );
  const [suggestedValues, setSuggestedValues] = useState<Pick<T, 'id' | 'name'>[]>([]);
  const [chosenItem, setChosenItem] = useState<Pick<T, 'id' | 'name'>>({ name: '', id: '' });
  const [isExpandedSelected, setIsExpandedSelected] = useState(false);

  const { setValue } = useFormContext();

  function deleteSelectedValueHandler(id: string) {
    const newValues = selectedValues.filter((value) => value.id !== id);
    if (props.name) {
      setValue(props.name, newValues, { shouldValidate: true });
    }
  }
  const sortedFilteredOptions = useCallback(
    (optionsToFilter = filteredOptions) => optionsToFilter.slice().sort((a, b) => a.name.localeCompare(b.name)),
    [filteredOptions]
  );

  function isValueSelected(value: string) {
    return selectedValues.find((item) => item.id === value);
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
        const currentIndex = sortedFilteredOptions().findIndex((item) => item === prevState);
        if (currentIndex > -1 && currentIndex < sortedFilteredOptions().length - 1) {
          scrollSelectToPosition(currentIndex * 64);
          return sortedFilteredOptions()[currentIndex + 1];
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
        const currentIndex = sortedFilteredOptions().findIndex((item) => item === prevState);
        if (currentIndex > 0) {
          scrollSelectToPosition(currentIndex * 64 - 64);
          return sortedFilteredOptions()[currentIndex - 1];
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
        setSelectOpen(false);
        setChosenItem({ name: '', id: '' });
        if (props.name) {
          if (isValueSelected(chosenItem.id)) {
            deleteSelectedValueHandler(chosenItem.id);
          } else {
            const newValues = [...selectedValues, chosenItem];
            setSelectedValues(newValues);
            setValue(props.name, newValues, { shouldValidate: true });
          }
        }
        setSearchValue('');
      }
    }
  }

  function searchOptionsHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectOpen(true);
    setSearchValue(event.target.value);
    const newFilteredOptions = options.filter((item) =>
      item.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredOptions(sortedFilteredOptions(newFilteredOptions));
    if (sortedFilteredOptions(newFilteredOptions).length) {
      setChosenItem(
        sortedFilteredOptions(newFilteredOptions).filter(
          (filteredItem) => !selectedValues.map((selectedItem) => selectedItem.name).includes(filteredItem.name)
        )[0]
      );
    }
  }

  function selectValueHandler(value: Pick<T, 'id' | 'name'>) {
    setSelectOpen(true);
    if (isValueSelected(value.id)) {
      deleteSelectedValueHandler(value.id);
    } else {
      const newValues = [...selectedValues, value];
      setSelectedValues(newValues);
      if (props.name) {
        setValue(props.name, newValues, { shouldValidate: true });
      }
    }
  }

  function addSuggestedCategoryHandler(value: Pick<T, 'id' | 'name'>) {
    const newValues = [...selectedValues, value];
    if (props.name) {
      setValue(props.name, newValues, { shouldValidate: true });
      setSuggestedValues((prevState) => prevState.filter((item) => item.id !== value.id));
    }
  }

  const dropdownRef = useRef<HTMLDivElement>(document.createElement('div'));

  useEffect(() => {
    setFilteredOptions(options);

    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && selectOpen === true) {
        setSelectOpen(false);
        setChosenItem({ name: '', id: '' });
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [options, selectedValues, selectOpen]);

  useEffect(() => {
    setSelectedValues(props.value as []);
  }, [props.value]);

  useEffect(() => {
    if (!sortedFilteredOptions(filteredOptions).includes(chosenItem)) {
      setChosenItem(
        sortedFilteredOptions(filteredOptions).filter(
          (filteredItem) => !selectedValues.map((selectedItem) => selectedItem.name).includes(filteredItem.name)
        )[0]
      );
    }
  }, [chosenItem, filteredOptions, selectedValues, sortedFilteredOptions]);

  useEffect(() => {
    if (suggestedOptions) {
      setSuggestedValues(
        suggestedOptions.filter((item) => !selectedValues.some((value) => value.id === item.id)).slice(0, 9)
      );
    } else {
      setSuggestedValues(options.filter((item) => !selectedValues.some((value) => value.id === item.id)).slice(0, 9));
    }
  }, [options, selectedValues, suggestedOptions]);

  function clearMultiSelect() {
    setSearchValue('');
  }

  return (
    <>
      {label && (
        <label className="font-bold" htmlFor={props.id}>
          {label}
        </label>
      )}
      <div ref={dropdownRef} className="relative max-w-full">
        {startIcon && (
          <span className="absolute top-1/2 left-4 mt-1 translate-y-[-50%] fill-accent-green">{startIcon}</span>
        )}
        <input
          ref={ref}
          onKeyDown={searchInputKeyPressHandler}
          onClick={() => setSelectOpen((prevState) => !prevState)}
          onChange={searchOptionsHandler}
          placeholder={placeholder}
          value={searchValue}
          className={`${
            error ? 'border-state-error focus:border-state-error' : ''
          } appearance-none mt-2 w-full border-2 border-label-disableBG py-5 px-4 cursor-pointer ${
            startIcon ? 'pl-12' : 'pl-4'
          } ${
            className || ''
          } pr-16 focus:outline-none focus:border-main-primary placeholder:text-label-disable option:disabled:text-label-disable font-medium ${
            selectOpen ? 'border-main-primary outline-none' : ''
          }`}
          disabled={disabled}
        />

        {!disabled && (
          <div className="absolute inset-y-0 right-0 flex items-center px-2 mt-2">
            {searchValue && (
              <DeclineIcon className="fill-main-secondary cursor-pointer m-1" onClick={clearMultiSelect} />
            )}
            <div onClick={() => setSelectOpen((prevState) => !prevState)} className="cursor-pointer">
              {selectOpen ? (
                <ChevronUp className="fill-main-secondary" />
              ) : (
                <ChevronDown className="fill-main-secondary" />
              )}
            </div>
          </div>
        )}

        {selectOpen && (
          <ul
            ref={listRef}
            className="absolute w-full max-h-[300px] overflow-y-scroll border-t-0 shadow-lg cursor-pointer z-10"
          >
            {sortedFilteredOptions().map((item) => (
              <li
                onMouseEnter={() => setChosenItem(item)}
                onClick={() => {
                  selectValueHandler(item);
                  setSelectOpen(!selectOpen);
                }}
                className={`py-5 px-4 hover:bg-main-primary hover:text-accent-white ${
                  chosenItem && chosenItem.name === item.name ? 'bg-main-primary text-accent-white' : ''
                } ${isValueSelected(item.id) ? 'bg-state-activeFill hover:bg-state-activeFill' : 'bg-accent-white'}`}
                key={item.id}
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-state-error mb-0">* {error}</p>}

      {selectedValues.length > 0 && (
        <div className="border-t-0 border-label-disableBG py-3 px-4 border-2">
          <div className="flex flex-col items-start sm:items-center gap-5 sm:gap-10 justify-between sm:flex-row">
            <div className="flex flex-wrap gap-2">
              {selectedValues.slice(0, isExpandedSelected ? selectedValues.length : 3).map((item) => (
                <div
                  key={item.id}
                  className="relative text-label-white font-bold px-2 sm:px-3 py-3 flex bg-main-primary items-center gap-1 sm:gap-6"
                >
                  {item.name}
                  <div className="flex items-center justify-center">
                    <DeclineIcon
                      onClick={() => deleteSelectedValueHandler(item.id)}
                      className="fill-accent-white cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
            {selectedValues.length > 3 && !isExpandedSelected ? (
              <>
                <div onClick={() => setIsExpandedSelected(true)} className="font-bold text-3xl cursor-pointer">
                  ...
                </div>
                <div
                  onClick={() => setIsExpandedSelected(true)}
                  className="font-bold p-2 border-2 border-main-secondary min-w-[fit-content] cursor-pointer"
                >
                  + {selectedValues.length - 3}
                </div>
              </>
            ) : (
              selectedValues.length > 3 &&
              isExpandedSelected && (
                <div>
                  <DeclineIcon
                    onClick={() => setIsExpandedSelected(false)}
                    className="stroke-main-secondary fill-main-secondary cursor-pointer"
                  />
                </div>
              )
            )}
          </div>
        </div>
      )}
      {suggested && suggestedValues.length > 0 && (
        <div className="mt-8 lg:block">
          {suggested}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {suggestedValues.map((item) => (
              <div
                onClick={() => addSuggestedCategoryHandler(item)}
                key={item.id}
                className="relative cursor-pointer font-bold px-2 py-2 flex bg-label-white border-2 border-fill-border items-center justify-between mt-2"
              >
                {item.name}
                <div className="flex items-center justify-center">
                  <PlusIcon
                    onClick={() => addSuggestedCategoryHandler(item)}
                    className="fill-main-secondary cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
MultiSelect.displayName = 'MultiSelect';
export default React.forwardRef(MultiSelect);
