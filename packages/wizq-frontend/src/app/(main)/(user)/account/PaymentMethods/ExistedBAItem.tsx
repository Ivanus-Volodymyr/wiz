import React, { useState } from 'react';
import InformationItem from '../InformationItem';
import { PaymentAction, PaymentInformationBA } from '../../../../../types/payment';

import RBCLogo from '../../../../../assets/icons/rbc-logo.svg';
import VerticalDots from '../../../../../assets/icons/vertical-dots.svg';
import { PaymentActions } from './index';

type Props = {
  baDetails: PaymentInformationBA;
  isPrimary: boolean;
  actions: PaymentAction[];
};

const ExistedBAItem = ({ baDetails, isPrimary, actions }: Props) => {
  const [actionsOpen, setActionOpen] = useState<boolean>(false);

  const BAText: React.FC = () => {
    return (
      <div className="flex items-center gap-[10px]">
        <p>{baDetails.bank}</p>
        <span className="rounded-full w-[7px] h-[7px] bg-content-secondary"></span>
        <p>account - {baDetails.digits}</p>
      </div>
    );
  };

  return (
    <>
      <div className="py-6 pr-7 pl-12 rounded-[3px] border-[1px] border-border-default flex justify-between bg-content-warm items-center flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-9 flex-col sm:flex-row">
          <div>
            <RBCLogo />
          </div>
          <InformationItem label="Bank account" text={<BAText />} />
        </div>
        {isPrimary && <div className="text-main-primary">Primary</div>}
        <div className="cursor-pointer relative">
          <PaymentActions
            isVisible={actionsOpen}
            onClose={() => setActionOpen(false)}
            actions={actions}
            id={baDetails.id}
          />
          <VerticalDots onClick={() => setActionOpen((prevState) => !prevState)} className="stroke-main-secondary" />
        </div>
      </div>
    </>
  );
};

export default ExistedBAItem;
