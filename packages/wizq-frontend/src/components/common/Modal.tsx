import React, { useState } from 'react';
import CloseIcon from '../../assets/icons/Icons=Times.svg';
import Button from './Button';
import Checkbox from './Checkbox';

type Props = {
  modalId?: string;
  onClose?: () => void;
  isOpen: boolean;
  title?: string | React.ReactNode;
  children: React.ReactNode;
  button?: JSX.Element;
  onButtonClick?: () => void;
  doNotShowCheck?: boolean;
  headerClassName?: string;
  className?: string;
};

const Modal = ({
  onClose,
  title,
  children,
  button,
  onButtonClick,
  doNotShowCheck,
  modalId,
  isOpen,
  headerClassName,
  className,
}: Props) => {
  const [dontShowChecked, setDontShowChecked] = useState(true);

  function closeModalHandler(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
    if (dontShowChecked) {
      localStorage.setItem(modalId, 'true');
    } else {
      localStorage.removeItem(modalId);
    }
    if (onClose) {
      onClose();
    }
  }

  function doNotShowCheckboxChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setDontShowChecked(event.target.checked);
  }

  if (!isOpen) {
    return;
  }

  return (
    <>
      <div
        className="fixed top-0 left-0 items-center z-30 bg-[#0d18353b] h-[100vh] w-[100vw]"
        onClick={closeModalHandler}
      ></div>
      <div
        className={`fixed text-center top-0 left-0 z-30 overflow-auto w-full h-full md:w-[500px] lg:w-[800px] lg:left-1/2 lg:translate-x-[-50%] lg:h-auto bg-label-white inline-block lg:mt-[100px] lg:overflow-auto lg:max-h-[80vh] ${
          className || ''
        }`}
      >
        <div className={`flex justify-between text-3xl font-bold font-montserrat p-8 ${headerClassName || ''}`}>
          <div>{title}</div>
          <div onClick={closeModalHandler} className="cursor-pointer">
            <CloseIcon className="fill-main-secondary" />
          </div>
        </div>
        <div>{children}</div>
        {(button || doNotShowCheck) && (
          <div className="p-8">
            {button && (
              <Button
                onClick={(event) =>
                  onButtonClick ? onButtonClick() : closeModalHandler(event as React.MouseEvent<HTMLDivElement>)
                }
                className="bg-main-primary w-full mt-9"
                color={'primary'}
              >
                {button}
              </Button>
            )}
            {doNotShowCheck && (
              <div className="mt-9 flex justify-center">
                <Checkbox
                  onChange={doNotShowCheckboxChangeHandler}
                  checked={dontShowChecked}
                  label="Don't show this again"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Modal;
