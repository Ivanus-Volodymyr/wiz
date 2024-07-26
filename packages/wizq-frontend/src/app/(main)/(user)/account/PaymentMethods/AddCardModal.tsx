import React, { useEffect, useMemo } from 'react';

import Modal from '../../../../../components/common/Modal';
import Input from '../../../../../components/common/Input';
import Checkbox from '../../../../../components/common/Checkbox';
import Button from '../../../../../components/common/Button';

import UserIcon from '../../../../../assets/icons/Icons=User.svg';
import CardIcon from '../../../../../assets/icons/Icons=Payment Card.svg';
import LockIcon from '../../../../../assets/icons/Icons=lock, Property 1=Variant55.svg';

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

import { AddCardFormData, PaymentInformationCard, Payments } from '../../../../../types/payment';

import { useDispatch, useSelector } from '../../../../../store';
import { editCard, setNewCard, setPrimaryPayment, setSelectedPayment } from '../../../../../store/projects';

import { Controller, FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import valid from 'card-validator';
import InputMask from 'react-input-mask';

type Props = {
  onCloseModal: () => void;
  isOpen: boolean;
};

const Title: React.FC = () => {
  return (
    <div className="flex gap-2 items-center">
      <div>
        <CardIcon className="fill-main-primary" />
      </div>
      <p className="text-lg font-medium font-karla">Add credit or debit card</p>
    </div>
  );
};

const AddCardModal = ({ onCloseModal, isOpen }: Props) => {
  const dispatch = useDispatch();
  const { payments } = useSelector((state) => state.auth.user);
  const { selectedPayment } = useSelector((state) => state.payment);
  const selectedCard = (payments as Payments)?.cards?.find((item) => item?.id === selectedPayment);
  const cardNumberMask = '9999 9999 9999 9999';

  const defaultValues: AddCardFormData = useMemo(() => {
    return {
      holder: selectedCard?.holder || '',
      number: '',
      cvc: '',
      expDate: selectedCard?.expDate || '',
      makePrimary: false,
    };
  }, [selectedCard?.expDate, selectedCard?.holder]);

  const addCardSchema = yup.object({
    holder: yup
      .string()
      .test('test-number', "Please enter the cardholder's name.", (value) => valid.cardholderName(value).isValid)
      .required(),
    number: yup
      .string()
      .test('test-number', 'Please enter a valid card number.', (value) => valid.number(value).isValid)
      .required(),
    expDate: yup
      .string()
      .test('test-number', 'Please enter a valid expiry date.', (value) => valid.expirationDate(value).isValid)
      .required(),
    cvc: yup
      .string()
      .test('test-number', 'Please enter a valid CVC.', (value) => valid.cvv(value).isValid)
      .required(),
  });

  const methods = useForm<AddCardFormData>({
    defaultValues,
    resolver: yupResolver(addCardSchema),
    resetOptions: { keepIsSubmitted: true },
  });

  const {
    reset,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitted, dirtyFields, isSubmitSuccessful },
  } = methods;

  const closeModalHandler = () => {
    onCloseModal();
    dispatch(setSelectedPayment(null));
  };

  const allFieldsAreDirty = dirtyFields.holder && dirtyFields.number && dirtyFields.expDate && dirtyFields.cvc;

  const createDummyCard = (card: PaymentInformationCard) => {
    dispatch(setNewCard(card));
  };

  const editDummyCard = (card: PaymentInformationCard) => {
    dispatch(editCard(card));
  };

  const cardType = valid.number(watch('number')).card?.type;
  console.log(cardType);

  const submitFormHandler = (data: AddCardFormData) => {
    const newCard: PaymentInformationCard = {
      id: selectedCard ? selectedPayment : Math.random().toString(),
      expDate: data.expDate,
      type: cardType,
      digits: data.number.trim().slice(-4),
      variety: 'Debit',
      holder: data.holder,
    };
    if (selectedCard) {
      editDummyCard(newCard);
    } else {
      createDummyCard(newCard);
    }
    if (data.makePrimary) {
      dispatch(setPrimaryPayment(newCard.id));
    }
    closeModalHandler();
  };

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, isSubmitSuccessful, reset]);

  return (
    <Modal
      onClose={closeModalHandler}
      headerClassName="text-lg !font-karla font-medium border-b-[1px] border-border-default"
      title={<Title />}
      className="lg:!w-[522px]"
      isOpen={isOpen}
    >
      <div className="py-10 px-7">
        {selectedCard ? (
          <p className="text-left">Enter card details to edit this payment method</p>
        ) : (
          <p className="text-left">Enter card details to add this payment method</p>
        )}
        <div className="mt-12 px-4 text-left">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitFormHandler)}>
              <div className="flex flex-col gap-3">
                <Controller
                  control={control}
                  name="holder"
                  render={({ field }) => (
                    <Input
                      id="holder"
                      error={errors.holder?.message || ''}
                      isSubmitted={isSubmitted}
                      startIcon={<UserIcon className="stroke-main-secondary" />}
                      className="w-full font-medium"
                      label="Card holder"
                      placeholder="Enter card holders name"
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="number"
                  render={({ field }) => (
                    <InputMask mask={cardNumberMask} maskChar={null} {...field} ref={null}>
                      {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
                        <Input
                          id="number"
                          ref={field.ref}
                          isSubmitted={isSubmitted}
                          error={errors.number?.message || ''}
                          startIcon={<CardIcon className="fill-main-secondary" />}
                          className="w-full font-medium"
                          label="Card number"
                          placeholder="Enter card number"
                          endIcon={
                            <>
                              {cardType === 'visa' && <VisaIcon />}
                              {cardType === 'mastercard' && <MastercardIcon />}
                              {cardType === 'discover' && <DiscoverIcon />}
                              {cardType === 'american-express' && <AmexIcon />}
                              {cardType === 'maestro' && <MaestroIcon />}
                              {cardType === 'unionpay' && <UnionIcon />}
                              {cardType === 'diners-club' && <DinersIcon />}
                              {cardType === 'elo' && <EloIcon />}
                              {cardType === 'jcb' && <JcbIcon />}
                              {cardType === 'hipercard' && <HiperCardIcon />}
                            </>
                          }
                          {...(cardNumberMask ? inputProps : field)}
                        />
                      )}
                    </InputMask>
                  )}
                />
                <div className="flex gap-5">
                  <Controller
                    control={control}
                    name="expDate"
                    render={({ field }) => (
                      <InputMask mask="99/99" {...field} ref={null}>
                        {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
                          <Input
                            id="expDate"
                            ref={field.ref}
                            isSubmitted={isSubmitted}
                            error={errors.expDate?.message || ''}
                            startIcon={<UserIcon className="stroke-main-secondary" />}
                            className="w-full font-medium"
                            label="Expiry date"
                            placeholder="MM/YY"
                            {...inputProps}
                          />
                        )}
                      </InputMask>
                    )}
                  />
                  <Controller
                    control={control}
                    name="cvc"
                    render={({ field }) => (
                      <Input
                        id="cvc"
                        isSubmitted={isSubmitted}
                        number
                        maxLength={4}
                        error={errors.cvc?.message || ''}
                        startIcon={<LockIcon className="stroke-main-secondary" />}
                        className="w-full font-medium"
                        label="CVC"
                        placeholder="Enter security code"
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
              <div>
                <Controller
                  control={control}
                  name="makePrimary"
                  render={({ field }) => (
                    <Checkbox
                      className="!text-base font-normal"
                      error={errors.makePrimary?.message || ''}
                      label="Make this primary payment method"
                      checked={field.value}
                      {...field}
                    />
                  )}
                />
              </div>

              <div className="mt-10 flex justify-between gap-6">
                <Button
                  onClick={closeModalHandler}
                  color="primary"
                  outline
                  className="h-auto py-4 w-[20%] rounded-[3px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  className="h-auto py-4 w-[80%] rounded-[3px]"
                  disabled={selectedCard ? false : !allFieldsAreDirty}
                >
                  Save card
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </Modal>
  );
};

export default AddCardModal;
