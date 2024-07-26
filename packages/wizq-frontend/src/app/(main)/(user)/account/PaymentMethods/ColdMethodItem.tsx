import React from 'react';
import CardIcon from '../../../../../assets/icons/Icons=Payment Card.svg';
import BankIcon from '../../../../../assets/icons/bank.svg';
import InformationItem from '../InformationItem';
import Button from '../../../../../components/common/Button';

type Props = {
  type: 'cc' | 'ba';
  onAddPayment?: () => void;
};

const ColdMethodItem = ({ type, onAddPayment }: Props) => {
  return (
    <>
      <div className="p-3 sm:py-6 sm:pr-7 sm:pl-12 rounded-[3px] border-[1px] border-border-default flex justify-between flex-col md:flex-row gap-4">
        <div className="flex items-center gap-9">
          <div>
            {type === 'cc' ? (
              <CardIcon className="fill-main-secondary" />
            ) : (
              <BankIcon className="stroke-main-secondary" />
            )}
          </div>
          {type === 'cc' ? (
            <InformationItem label="Credit or debit card" text="No card on file" />
          ) : (
            <InformationItem label="Bank account" text="No bank account synced" />
          )}
        </div>
        <Button className="rounded-[3px] h-auto py-4" onClick={onAddPayment} color="primary" outline type="button">
          Set up
        </Button>
      </div>
    </>
  );
};

export default ColdMethodItem;
