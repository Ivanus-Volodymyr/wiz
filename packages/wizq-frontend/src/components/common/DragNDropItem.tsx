import React, { useRef, useState } from 'react';
import { useDrag, useDrop, type DragObjectFactory } from 'react-dnd';
import type { XYCoord } from 'dnd-core';

import MoreHorizontalIcon from '../../assets/icons/more-horizontal.svg';
import CloseIcon from '../../assets/icons/Icons=Times.svg';
import UpdateIcon from '../../assets/icons/Icons=Icons145, Property 1=Wizquotes icon.svg';
import SuccessIcon from '../../assets/icons/Icons=Check.svg';

import Input from './Input';
import IconButton from './IconButton';

const ItemTypes = {
  CARD: 'item',
};

type Props = {
  id: string;
  text: string;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  onDeleteItem: (id: string) => void;
  onUpdateItem: (id: string, name: string) => void;
};

interface DragItem {
  index: number;
  id: string;
}

interface DragResult {
  isDragging: boolean;
}

const DragNDropItem = ({ id, text, index, moveCard, onDeleteItem, onUpdateItem }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: string | symbol | null }>({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCard(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag<DragObjectFactory<DragItem>, DragResult, DragResult>({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(drop(ref));

  const [addNewInputValue, setAddNewInputValue] = useState<string>(text);
  const [edit, setEdit] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  function saveNewValueHandler() {
    const pattern = /^(?!\s*$).+/;
    if (!addNewInputValue.length || !pattern.test(addNewInputValue)) {
      setErr('The value cannot be empty');
      return;
    }
    onUpdateItem(id, addNewInputValue);
    return setEdit(false);
  }
  function onAddNewInputChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.value.length) {
      setErr('The value cannot be empty');
    }
    setErr(null);
    setAddNewInputValue(event.target.value);
  }

  function newValueInputEnterPressHandler(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      saveNewValueHandler();
    }
  }
  return (
    <>
      {edit ? (
        <div className="flex items-center justify-between w-full">
          <IconButton
            type="button"
            className="mr-[12px]"
            onClick={() => {
              setAddNewInputValue(text);
              setEdit(!edit);
            }}
            icon={<CloseIcon className="fill-accent-white" />}
          />
          <Input
            id="project-description"
            className="w-full font-medium"
            placeholder="Enter a new task value"
            onKeyDown={newValueInputEnterPressHandler}
            value={addNewInputValue}
            onChange={onAddNewInputChangeHandler}
            error={err}
          />
          <IconButton
            className="mr-[0px] ml-4"
            type="button"
            onClick={saveNewValueHandler}
            icon={<SuccessIcon className="fill-accent-white" />}
          />
        </div>
      ) : (
        <div
          ref={ref}
          data-handler-id={handlerId}
          className={`flex mt-4 gap-8 items-center cursor-grab ${isDragging ? 'opacity-0' : 'opacity-1'}`}
        >
          <div>
            <MoreHorizontalIcon />
          </div>
          <div className="w-full p-4 flex items-center justify-between border-2 border-[#CDD6EC]">
            <div className="flex gap-6 items-center">
              <div className="py-1 text-center w-[30px] bg-[#E0ECF8]">{index + 1}</div>
              <p>{text}</p>
            </div>
            <div className="flex gap-3">
              <div onClick={() => onDeleteItem(id)} className="cursor-pointer">
                <CloseIcon className="fill-main-secondary" />
              </div>
              <div onClick={() => setEdit(!edit)} className="cursor-pointer">
                <UpdateIcon />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DragNDropItem;
