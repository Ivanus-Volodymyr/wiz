import React, { useState } from 'react';
import Modal from '../../../../../components/common/Modal';
import { LinkBAMainStep } from './LinkBA';

import BankIcon from '../../../../../assets/icons/bank.svg';
import LinkBAManualStep from './LinkBA/LinkBAManualStep';

const Title: React.FC = () => {
  return (
    <div className="flex gap-2 items-center">
      <div>
        <BankIcon className="stroke-main-primary" />
      </div>
      <p className="text-lg font-medium font-karla">Link bank account</p>
    </div>
  );
};

type Props = {
  onCloseModal: () => void;
  isOpen: boolean;
};

const AddBAModal = ({ onCloseModal, isOpen }: Props) => {
  const [step, setStep] = useState<string>('main');
  const [selectedBASetup, setSelectedBASetup] = useState('auto');

  const closeModalHandler = () => {
    setSelectedBASetup('auto');
    setStep('main');
    onCloseModal();
  };

  const nextStepHandler = () => {
    setStep(selectedBASetup);
  };

  const selectBASetupHandler = (setupType: string) => {
    setSelectedBASetup(setupType);
  };

  return (
    <Modal
      onClose={closeModalHandler}
      headerClassName="text-lg !font-karla font-medium border-b-[1px] border-border-default"
      title={<Title />}
      className="lg:!w-[522px]"
      isOpen={isOpen}
    >
      {step === 'main' && (
        <LinkBAMainStep
          onCloseModal={closeModalHandler}
          selectedMethod={selectedBASetup}
          onSelectMethod={selectBASetupHandler}
          onContinue={nextStepHandler}
        />
      )}
      {step === 'manual' && <LinkBAManualStep onCloseModal={closeModalHandler} />}
    </Modal>
  );
};

export default AddBAModal;
