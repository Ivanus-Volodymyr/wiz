import React, { useState } from 'react';

import InformationItem from '../InformationItem';
import { PaymentActions } from './index';

import { PaymentAction, PaymentInformationCard } from '../../../../../types/payment';

import VerticalDots from '../../../../../assets/icons/vertical-dots.svg';
import VisaIcon from '../../../../../assets/icons/cards/visa.svg';
import MastercardIcon from '../../../../../assets/icons/cards/mastercard.svg';
import AmexIcon from '../../../../../assets/icons/cards/amex.svg';
import DiscoverIcon from '../../../../../assets/icons/cards/discover.svg';
import MaestroIcon from '../../../../../assets/icons/cards/maestro.svg';
import UnionIcon from '../../../../../assets/icons/cards/unionpay.svg';
import DinersIcon from '../../../../../assets/icons/cards/diners-club.svg';
import EloIcon from '../../../../../assets/icons/cards/elo.svg';
import JcbIcon from '../../../../../assets/icons/cards/jcb.svg';
import HiperCardIcon from '../../../../../assets/icons/cards/hipercard.svg';

type Props = {
  cardDetails: PaymentInformationCard;
  isPrimary: boolean;
  actions: PaymentAction[];
};

const ExistedCardItem = ({ cardDetails, isPrimary, actions }: Props) => {
  const [actionsOpen, setActionOpen] = useState<boolean>(false);

  const CardText: React.FC = () => {
    return (
      <div className="flex items-center gap-[10px]">
        <p>Ending in {cardDetails.digits}</p>
        <span className="rounded-full w-[7px] h-[7px] bg-content-secondary"></span>
        <p>Expires {cardDetails.expDate}</p>
      </div>
    );
  };

  return (
    <>
      <div className="px-0 py-3 sm:py-6 sm:pr-7 sm:pl-12 rounded-[3px] border-[1px] border-border-default flex justify-between bg-content-warm items-center flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-9 flex-col sm:flex-row">
          <div>
            {cardDetails.type === 'visa' && <VisaIcon />}
            {cardDetails.type === 'mastercard' && <MastercardIcon />}
            {cardDetails.type === 'discover' && <DiscoverIcon />}
            {cardDetails.type === 'american-express' && <AmexIcon />}
            {cardDetails.type === 'maestro' && <MaestroIcon />}
            {cardDetails.type === 'unionpay' && <UnionIcon />}
            {cardDetails.type === 'diners-club' && <DinersIcon />}
            {cardDetails.type === 'elo' && <EloIcon />}
            {cardDetails.type === 'jcb' && <JcbIcon />}
            {cardDetails.type === 'hipercard' && <HiperCardIcon />}
          </div>
          <InformationItem label={`USD ${cardDetails.variety}`} text={<CardText />} />
        </div>
        {isPrimary && <div className="text-main-primary">Primary</div>}
        <div className="cursor-pointer relative">
          <PaymentActions
            isVisible={actionsOpen}
            onClose={() => setActionOpen(false)}
            actions={actions}
            id={cardDetails.id}
          />
          <VerticalDots onClick={() => setActionOpen((prevState) => !prevState)} className="stroke-main-secondary" />
        </div>
      </div>
    </>
  );
};

export default ExistedCardItem;
