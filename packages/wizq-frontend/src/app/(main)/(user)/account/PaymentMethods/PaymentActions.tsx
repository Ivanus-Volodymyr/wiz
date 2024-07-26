import React, { useEffect, useRef } from 'react';
import { PaymentAction } from '../../../../../types/payment';
import { PaymentActionsItem } from './index';

type Props = {
  actions: PaymentAction[];
  id: string;
  onClose: () => void;
  isVisible: boolean;
};

const PaymentActions = ({ actions, id, isVisible, onClose }: Props) => {
  const paymentActionsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (isVisible) {
      const handleOutsideClick = (event: MouseEvent) => {
        if (paymentActionsRef.current && !paymentActionsRef.current.contains(event.target as Node)) {
          onClose();
        }
      };

      document.addEventListener('click', handleOutsideClick);
      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    }
  }, [isVisible, onClose]);

  if (!isVisible) {
    return;
  }

  return (
    <ul
      ref={paymentActionsRef}
      className="absolute right-[-100px] sm:right-0 xl:left-0 rounded-[3px] bg-white z-[1] w-[max-content] drop-shadow shadow-[#0D18351A]"
    >
      {actions.map((item) => (
        <PaymentActionsItem onClose={onClose} paymentId={id} item={item} key={item.text} />
      ))}
    </ul>
  );
};

export default PaymentActions;
