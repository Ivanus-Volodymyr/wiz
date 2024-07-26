import React from 'react';
import Button from '../../../../../components/common/Button';

import PencilIcon from '../../../../../assets/icons/Icons=Pencil.svg';
import InformationItem from '../InformationItem';

const PersonalInformation = () => {
  return (
    <div className="px-[7%] pt-12 pb-10 border-b-[1px] border-border-default">
      <div className="flex justify-between gap-4 flex-col lg:flex-row">
        <h5 className="font-montserrat font-medium text-xl">Personal information</h5>
        <Button color="primary" className="rounded-[3px]" outline>
          <p>Edit</p>
          <PencilIcon className="fill-main-primary" />
        </Button>
      </div>
      <div className="pt-9 px-4 lg:w-[60%] space-y-[76px]">
        <div className="flex justify-between flex-col lg:flex-row gap-4">
          <InformationItem label="First name" text="Jessica" />
          <InformationItem label="Last name" text="Doe" />
        </div>
        <div className="flex justify-between flex-col lg:flex-row gap-4">
          <InformationItem label="Email address" text="jessicadoe@email.com (Verified)" />
          <InformationItem label="Phone" text="111-222-333-4444" />
        </div>
        <div className="flex justify-between flex-col lg:flex-row gap-4">
          <InformationItem
            label="Bio"
            text="Lorem ipsum dolor sit amet consectetur. Mi dui mauris tincidunt cras malesuada tincidunt netus tempor. Metus aenean eget nullam ipsum at et."
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
