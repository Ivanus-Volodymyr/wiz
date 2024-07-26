import React from 'react';
import Selection from '../../../../../components/common/Selection';
import BankIcon from '../../../../../assets/icons/bank.svg';
import CardIcon from '../../../../../assets/icons/Icons=Payment Card.svg';
import Modal from '../../../../../components/common/Modal';

type Props = {
  onCloseModal: () => void;
  isOpen: boolean;
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
};

const AddPaymentMethodModal = ({ onSelectMethod, onCloseModal, selectedMethod, isOpen }: Props) => {
  return (
    <Modal
      onClose={onCloseModal}
      headerClassName="text-lg !font-karla font-medium border-b-[1px] border-border-default"
      title="Add payment method"
      className="lg:!w-[522px]"
      isOpen={isOpen}
    >
      <div className="py-10 px-7">
        <p className="text-left">Select payment method you’d like to continue with</p>
        <div className="flex flex-col gap-3 mt-12 px-4">
          <Selection
            className="rounded-[3px] py-7 px-5"
            header={<p className={selectedMethod === 'ba' ? 'text-main-primary' : ''}>Bank account</p>}
            icon={<BankIcon className="stroke-main-primary" />}
            onSelect={onSelectMethod}
            selected={selectedMethod}
            id="ba"
          />
          <Selection
            className="rounded-[3px] py-7 px-5"
            header={<p className={selectedMethod === 'cc' ? 'text-main-primary' : ''}>Credit or debit card</p>}
            icon={<CardIcon className="fill-main-primary" />}
            onSelect={onSelectMethod}
            selected={selectedMethod}
            id="cc"
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddPaymentMethodModal;
