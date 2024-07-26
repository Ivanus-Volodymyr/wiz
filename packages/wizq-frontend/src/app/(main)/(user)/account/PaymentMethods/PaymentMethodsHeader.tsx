import React from 'react';
import Button from '../../../../../components/common/Button';
import PlusIcon from '../../../../../assets/icons/Icons=Plus.svg';

type Props = {
  onAddClick: () => void;
};

const PaymentMethodsHeader = ({ onAddClick }: Props) => {
  return (
    <div>
      <div className="flex justify-between flex-col md:flex-row gap-4">
        <h5 className="font-medium font-montserrat text-xl">Payment information</h5>
        <Button color="primary" className="rounded-[3px]" onClick={onAddClick}>
          <p className="w-full">Add payment method</p>
          <div>
            <PlusIcon className="fill-white" />
          </div>
        </Button>
      </div>
      <p className="w-[70%] mt-2">
        Manage payment methods for your Wizquotes account, this shows that you can pay Service providers for services
        rendered
      </p>
    </div>
  );
};

export default PaymentMethodsHeader;
