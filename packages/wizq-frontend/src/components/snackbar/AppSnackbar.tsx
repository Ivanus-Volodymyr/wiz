import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CloseIcon from '../../assets/icons/Icons=Times.svg';
import IconButton from '../common/IconButton';

type CloseButtonProps = {
  closeToast: () => void;
};

type MsgProps = {
  message: string;
  icon?: React.JSX.Element;
};

const CloseButton = ({ closeToast }: CloseButtonProps) => {
  return (
    <IconButton
      className="!bg-[#77E8A5] h-full !m-0 p-5"
      onClick={closeToast}
      icon={<CloseIcon className="fill-main-secondary" />}
    />
  );
};

export const Msg = ({ message, icon }: MsgProps) => {
  return (
    <div className="flex gap-3 items-center lg:pl-[6%]">
      {icon && <div>{icon}</div>}
      <p className="text-lg text-white font-bold">{message}</p>
    </div>
  );
};

export const successSnackbar = (message: string, icon?: React.JSX.Element): void => {
  console.log(`Toast: ${message}`);

  toast(<Msg message={message} icon={icon} />, {
    position: 'top-left',
    autoClose: 3000,
    pauseOnHover: true,
    draggable: false,
    closeOnClick: true,
    hideProgressBar: true,
    style: {
      background: 'none',
      boxShadow: 'none',
    },
  });
};

const AppSnackbar = () => {
  return (
    <ToastContainer
      className="bg-[#34BE6D] !w-full !static top-0 left-0 !p-0"
      toastClassName="flex items-center justify-between !text-inherit !min-h-0 !m-0 !p-0 !rounded-[0px]"
      limit={1}
      closeOnClick={true}
      hideProgressBar
      // @ts-ignore
      closeButton={CloseButton}
    />
  );
};

export default AppSnackbar;
