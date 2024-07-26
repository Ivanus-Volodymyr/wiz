import React from 'react';
import SystemDevicesIcon from '../../../../../../assets/icons/system-devices.svg';
import Selection from '../../../../../../components/common/Selection';
import GearIcon from '../../../../../../assets/icons/Icons=Gear, Property 1=Wizquotes icon.svg';
import PencilLinkIcon from '../../../../../../assets/icons/pencil-link.svg';
import ShieldIcon from '../../../../../../assets/icons/shield.svg';
import Button from '../../../../../../components/common/Button';

type Props = {
  onCloseModal: () => void;
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
  onContinue: () => void;
};

const LinkBAMainStep = ({ selectedMethod, onSelectMethod, onCloseModal, onContinue }: Props) => {
  return (
    <>
      <div className="h-[160px] flex items-center justify-center bg-content-warm">
        <SystemDevicesIcon />
      </div>
      <div className="p-9 text-left">
        <p className="text-content-secondary">
          Link your bank account to make payments to service providers for work rendered
        </p>
        <div className="flex flex-col gap-4 mt-8 px-1">
          <Selection
            className="py-7 px-5"
            header={
              <p className={`${selectedMethod === 'auto' ? 'text-main-primary' : 'text-content-secondary'} font-bold`}>
                Automatic set up <span className="text-main-primary">(recommended)</span>
              </p>
            }
            description={<p className="text-content-secondary">Connect your bank using plaid</p>}
            icon={<GearIcon className="stroke-main-primary" />}
            onSelect={onSelectMethod}
            selected={selectedMethod}
            id="auto"
          />
          <Selection
            className="py-7 px-5"
            header={
              <p className={`${selectedMethod === 'auto' ? 'text-main-primary' : 'text-content-secondary'} font-bold`}>
                Manual set up
              </p>
            }
            description={<p className="text-content-secondary">Enter your account & routing information</p>}
            icon={<PencilLinkIcon className="stroke-main-primary" />}
            onSelect={onSelectMethod}
            selected={selectedMethod}
            id="manual"
          />
        </div>
        <div className="mt-6 px-4 py-3 bg-background-subtleNeutral flex gap-2 items-center">
          <div>
            <ShieldIcon className="stroke-main-primary" />
          </div>
          <p className="text-main-active">
            Your data is protected with 256-bit encryption and is never stored on your device or browser
          </p>
        </div>
        <div className="mt-10 flex justify-between gap-6">
          <Button onClick={onCloseModal} color="primary" outline className="h-auto py-4 w-[40%] rounded-[3px]">
            Cancel
          </Button>
          <Button type="button" onClick={onContinue} color="primary" className="h-auto py-4 w-[60%] rounded-[3px]">
            Continue
          </Button>
        </div>
      </div>
    </>
  );
};

export default LinkBAMainStep;
