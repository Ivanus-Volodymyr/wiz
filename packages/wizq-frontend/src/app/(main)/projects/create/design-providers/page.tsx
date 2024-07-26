'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import ProjectReviewSidePanel from '../ProjectReviewSidePanel';
import Modal from '../../../../../components/common/Modal';

import { useGetUserDataQuery } from '../../../../../store/users';
import { UserData } from '../../../../../types/user';
import { UserType1 } from '../../../../../types';

import modalAvatarsImage from '../../../../../assets/images/ModalAvatars.png';
import ArrowRightIcon from '../../../../../assets/icons/arrow-right.svg';
import { useSelector } from '../../../../../store';
import { useRouter } from 'next/navigation';
import ServiceProviderListItem from '../../../../../components/service-providers/ServiceProviderListItem';

const StartingInfoModalButton = () => {
  return (
    <>
      <p>Continue</p>
      <ArrowRightIcon />
    </>
  );
};

export default function ChooseDesignerProviderPage() {
  const startingInfoModalID = 'connectDesignerStartingModal';
  const [isStartingInfoModalOpen, setIsStartingInfoModalOpen] = useState<boolean>(false);
  const { data } = useGetUserDataQuery({ type: UserType1.SERVICE_PROVIDER });

  const [userData, setUserData] = useState<UserData[]>([]);

  useEffect(() => {
    if (!localStorage.getItem(startingInfoModalID)) {
      setIsStartingInfoModalOpen(true);
    }

    const users = data as unknown as UserData[];
    const filter = users?.filter((rs: UserData) => rs.subType === 'DESIGNER' && rs.Business.length !== 0);
    setUserData(filter);
  }, [data]);

  return (
    <>
      <Modal
        button={<StartingInfoModalButton />}
        isOpen={isStartingInfoModalOpen}
        modalId={startingInfoModalID}
        doNotShowCheck
        onClose={() => setIsStartingInfoModalOpen(false)}
      >
        <div className="mt-10 p-8">
          <div className="flex justify-center">
            <Image src={modalAvatarsImage} alt="modalAvatarsImage" />
          </div>
          <h4 className="mt-11 text-center font-bold font-montserrat text-2xl">Connect with Floorplan designers</h4>
          <p className="mt-6 text-[#788398] text-start">
            Your project has been put on hold but not to worry we have saved it for you until you complete your time
            with a designer.
          </p>
        </div>
      </Modal>
      <div className="grid lg:grid-cols-3 grid-rows-2 lg:grid-rows-none lg:gap-x-14 gap-y-14">
        <div className="lg:col-span-2">
          <div className="px-7">
            <p className="text-xl lg:text-[40px] font-medium font-montserrat">Connect with a designer</p>
            <p>{userData?.length.toLocaleString('en')} designers available</p>
          </div>
          <ul className="mt-9">
            {userData?.map((item: UserData, key: number) => (
              <ServiceProviderListItem key={key} data={item} />
            ))}
          </ul>
        </div>
        <ProjectReviewSidePanel isChoosingDesigner={true} />
      </div>
    </>
  );
}
