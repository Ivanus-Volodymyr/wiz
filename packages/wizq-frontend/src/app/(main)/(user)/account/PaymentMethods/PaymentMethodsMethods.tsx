import React from 'react';

import { ColdMethodItem, ExistedBAItem, ExistedCardItem } from './index';

import { PaymentAction } from '../../../../../types/payment';

import CardIcon from '../../../../../assets/icons/credit-card.svg';
import CheckIcon from '../../../../../assets/icons/Icons=Check.svg';
import TrashIcon from '../../../../../assets/icons/Icons=Trash.svg';
import UnlinkBankIcon from '../../../../../assets/icons/unlink-bank.svg';

import { useDispatch, useSelector } from '../../../../../store';
import { deleteBA, deleteCard, setPrimaryPayment, setSelectedPayment } from '../../../../../store/projects';

type Props = {
  onOpenAddCardModal: () => void;
  onOpenAddBAModal: () => void;
};

const PaymentMethodsMethods = ({ onOpenAddCardModal, onOpenAddBAModal }: Props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const makePrimaryHandler = (id: string) => {
    dispatch(setPrimaryPayment(id));
  };

  const editCardHandler = (id: string) => {
    dispatch(setSelectedPayment(id));
    onOpenAddCardModal();
  };

  const deleteCardHandler = (id: string) => {
    dispatch(deleteCard(id));
  };

  const deleteBAHandler = (id: string) => {
    dispatch(deleteBA(id));
  };

  const cardActions: PaymentAction[] = [
    {
      icon: <CardIcon />,
      text: 'Edit card',
      action: editCardHandler,
    },
    {
      icon: <CheckIcon className="stroke-none" />,
      text: 'Set as  primary method',
      action: makePrimaryHandler,
    },
    {
      icon: <TrashIcon className="stroke-none" />,
      text: 'Delete payment method',
      action: deleteCardHandler,
    },
  ];
  const baActions: PaymentAction[] = [
    {
      icon: <CheckIcon className="stroke-none" />,
      text: 'Set as  primary method',
      action: makePrimaryHandler,
    },
    {
      icon: <UnlinkBankIcon className="fill-white" />,
      text: 'Unlink Bank account',
      action: deleteBAHandler,
    },
  ];

  return (
    <>
      <div>
        <p className="font-medium text-lg">Payment methods</p>
        <div className="mt-6 space-y-7">
          {!user?.payments?.cards || !user?.payments?.cards?.length ? (
            <ColdMethodItem onAddPayment={onOpenAddCardModal} type="cc" />
          ) : (
            user.payments.cards.map((card) => (
              <ExistedCardItem
                actions={cardActions}
                key={card.id}
                cardDetails={card}
                isPrimary={card.id === user?.payments?.primaryId}
              />
            ))
          )}
          {!user?.payments?.bankAccounts || !user?.payments?.bankAccounts?.length ? (
            <ColdMethodItem onAddPayment={onOpenAddBAModal} type="ba" />
          ) : (
            user.payments.bankAccounts.map((ba) => (
              <ExistedBAItem
                actions={baActions}
                key={ba.id}
                baDetails={ba}
                isPrimary={ba.id === user?.payments?.primaryId}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentMethodsMethods;
