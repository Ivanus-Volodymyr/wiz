import React, { useEffect, useState } from 'react';
import DesignerListItem from './DesignerListItem';
import ProjectReviewSidePanel from './ProjectReviewSidePanel';
import Modal from '../../../../components/common/Modal';
import modalAvatarsImage from '../../../../assets/images/ModalAvatars.png';
import ArrowRightIcon from '../../../../assets/icons/arrow-right.svg';
import Image from 'next/image';
import { useSelector } from '../../../../store';
import { UserData } from '../../../../types/user';

const StartingInfoModalButton = () => {
  return (
    <>
      <p>Continue</p>
      <ArrowRightIcon />
    </>
  );
};

type Props = {
  onChangeStep: (step: number) => void;
  refetch: any;
};

const ConnectDesigner = ({ onChangeStep, refetch }: Props) => {
  const startingInfoModalID = 'connectDesignerStartingModal';
  const [isStartingInfoModalOpen, setIsStartingInfoModalOpen] = useState<boolean>(false);
  const { users } = useSelector((state) => state.users);

  const [userData, setUserData] = useState<UserData[]>([]);

  useEffect(() => {
    if (!localStorage.getItem(startingInfoModalID)) {
      setIsStartingInfoModalOpen(true);
    }

    const filter = users?.filter((rs: UserData) => rs.subType === 'DESIGNER' && rs.Business.length !== 0);
    setUserData(filter);
  }, [users]);

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
              <DesignerListItem key={key} data={item} refetch={refetch} />
            ))}
          </ul>
        </div>
        <ProjectReviewSidePanel onChangeStep={onChangeStep} isChoosingDesigner={true} />
      </div>
    </>
  );
};

export default ConnectDesigner;
