import React, { useState } from 'react';
import { PaymentMethodsHeader, PaymentMethodsMethods, AddPaymentMethodModal, AddCardModal, AddBAModal } from './index';

const PaymentMethods = () => {
  const [isAddMethodOpen, setIsAddMethodOpen] = useState<boolean>(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState<boolean>(false);
  const [isAddBAOpen, setIsAddBAOpen] = useState<boolean>(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const selectMethodHandler = (method: string) => {
    setSelectedMethod(method);
    setIsAddMethodOpen(false);
    if (method === 'cc') {
      setIsAddCardOpen(true);
    }
    if (method === 'ba') {
      setIsAddBAOpen(true);
    }
    setSelectedMethod('');
  };

  return (
    <>
      <AddPaymentMethodModal
        onSelectMethod={selectMethodHandler}
        selectedMethod={selectedMethod}
        onCloseModal={() => setIsAddMethodOpen(false)}
        isOpen={isAddMethodOpen}
      />
      <AddCardModal onCloseModal={() => setIsAddCardOpen(false)} isOpen={isAddCardOpen} />
      <AddBAModal onCloseModal={() => setIsAddBAOpen(false)} isOpen={isAddBAOpen} />
      <div className="px-[7%] py-16 space-y-12">
        <PaymentMethodsHeader onAddClick={() => setIsAddMethodOpen(true)} />
        <PaymentMethodsMethods
          onOpenAddCardModal={() => setIsAddCardOpen(true)}
          onOpenAddBAModal={() => setIsAddBAOpen(true)}
        />
      </div>
    </>
  );
};

export default PaymentMethods;
