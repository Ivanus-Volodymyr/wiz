import React, { ForwardedRef, useState } from 'react';
import { DragNDropListItem } from '../../types/common';
import DragNDropItem from './DragNDropItem';
import IconButton from './IconButton';
import DeclineIcon from '../../assets/icons/Icons=Times.svg';
import Plus from '../../assets/icons/Icons=Plus.svg';
import Input from './Input';
import SuccessIcon from '../../assets/icons/Icons=Check.svg';
import { useFormContext } from 'react-hook-form';
import AppLink from './AppLink';

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  label?: string;
  addText: string;
  error?: string;
  value: DragNDropListItem[];
}

const DragNDropList = ({ label, addText, error, ...props }: Props, ref: ForwardedRef<HTMLInputElement>) => {
  const [itemsList, setItemsList] = useState<DragNDropListItem[]>(
    (props.value as unknown as DragNDropListItem[]) || []
  );
  const [addNewActive, setAddNewActive] = useState<boolean>(false);
  const [addNewInputValue, setAddNewInputValue] = useState<string>('');
  const [err, setErr] = useState<string | null>(null);

  const { setValue } = useFormContext();

  function onAddNewInputChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setErr('');
    setAddNewInputValue(event.target.value);
  }

  function saveNewValueHandler() {
    const pattern = /^(?!\s*$).+/;

    if (!addNewInputValue.length || !pattern.test(addNewInputValue)) {
      setErr('The value cannot be empty');
      return;
    }

    if (addNewInputValue.length) {
      setErr('');
      const newValues = [...itemsList, { id: (Math.random() * 100000).toString(), name: addNewInputValue }];
      setItemsList(newValues);
      setAddNewInputValue('');
      if (props.name) {
        setValue(props.name, newValues, { shouldValidate: true });
      }
    }
  }

  function deleteElementHandler(id: string) {
    const newValues = itemsList.filter((item) => item.id !== id);
    setItemsList(newValues);

    if (props.name) {
      setValue(props.name, newValues, { shouldValidate: true });
    }
  }

  function updateElementHandler(id: string, name: string) {
    const findValue = itemsList.find((item) => item.id === id);
    findValue.name = name;
    if (props.name) {
      setValue(props.name, itemsList, { shouldValidate: true });
    }
  }

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const draggedItem = itemsList[dragIndex];
    const updatedItems = [...itemsList];
    updatedItems.splice(dragIndex, 1);
    updatedItems.splice(hoverIndex, 0, draggedItem);
    setItemsList(updatedItems);
    if (props.name) {
      setValue(props.name, updatedItems, { shouldValidate: true });
    }
  };

  function newValueInputEnterPressHandler(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      saveNewValueHandler();
    }
  }

  return (
    <>
      {label && (
        <label className="font-bold" htmlFor={props.id}>
          {label}
        </label>
      )}
      <input ref={ref} type="hidden" />

      {itemsList.map((item, index) => (
        <DragNDropItem
          key={item.id}
          id={item.id}
          text={item.name}
          index={index}
          moveCard={moveItem}
          onDeleteItem={deleteElementHandler}
          onUpdateItem={updateElementHandler}
        />
      ))}
      <div className="mt-8 flex items-center">
        <div
          onClick={() => {
            setErr('');
            setAddNewActive((prevState) => !prevState);
          }}
          className="flex items-center cursor-pointer max-w-[max-content]"
        >
          <IconButton
            type="button"
            className="mr-[12px]"
            icon={addNewActive ? <DeclineIcon className="fill-accent-white" /> : <Plus className="fill-accent-white" />}
          />
          <AppLink color="primary" className={`font-bold ${addNewActive ? 'hidden' : ''}`}>
            {addText}
          </AppLink>
        </div>
        {addNewActive && (
          <div className="flex gap-4 items-center justify-between w-full">
            <Input
              id="project-description"
              className="w-full font-medium"
              placeholder="Add new"
              onKeyDown={newValueInputEnterPressHandler}
              value={addNewInputValue}
              onChange={onAddNewInputChangeHandler}
              error={err}
            />
            <IconButton
              className="mr-[0px]"
              type="button"
              onClick={saveNewValueHandler}
              icon={<SuccessIcon className="fill-accent-white" />}
            />
          </div>
        )}
      </div>

      {error ? <p className="text-state-error mb-0">* {error}</p> : <p className="mb-0">&nbsp;</p>}
    </>
  );
};

export default React.forwardRef(DragNDropList);
