import React from 'react';

export interface PaymentInformationCard {
  id: string;
  type: string;
  variety: 'Debit' | 'Credit';
  digits: string;
  expDate: string;
  holder: string;
}

export interface PaymentInformationBA {
  id: string;
  bank: string;
  digits: string;
}

export interface Payments {
  primaryId: string;
  cards: PaymentInformationCard[];
  bankAccounts: PaymentInformationBA[];
}

export interface AddCardFormData {
  holder: string;
  number: string;
  expDate: string;
  cvc: string;
  makePrimary: boolean;
}

export interface AddBAFormData {
  routingNumber: string;
  accountNumber: string;
  confirmAccountNumber: string;
  makePrimary: boolean;
}

export interface PaymentAction {
  icon: React.JSX.Element;
  text: string;
  action: (id: string) => void;
}
