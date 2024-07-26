import React, { useState } from 'react';
import { PaymentAction } from '../../../../../types/payment';

type Props = {
  item: PaymentAction;
  onClose: () => void;
  paymentId: string;
};

const PaymentActionsItem = ({ item, onClose, paymentId }: Props) => {
  const [hovered, setHovered] = useState(false);

  const clickItemHandler = () => {
    item.action(paymentId);
    onClose();
  };

  return (
    <li
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="px-4 py-3 flex gap-4 hover:bg-[#017EFF] hover:text-[#fff] cursor-pointer"
      onClick={clickItemHandler}
    >
      <div className={`${hovered ? 'stroke-white fill-white' : 'stroke-main-secondary fill-main-secondary'}`}>
        {item.icon}
      </div>
      <p>{item.text}</p>
    </li>
  );
};

export default PaymentActionsItem;
