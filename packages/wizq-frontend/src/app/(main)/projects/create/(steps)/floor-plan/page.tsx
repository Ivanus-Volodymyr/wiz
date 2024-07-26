'use client';

import React, { useEffect, useState } from 'react';
import Selection from '../../../../../../components/common/Selection';
import FloorPlanIcon from '../../../../../../assets/icons/Icons=Floor plan.svg';
import PenIcon from '../../../../../../assets/icons/Icons=Pen.svg';
import InfoIcon from '../../../../../../assets/icons/Icons=Info-Cirlce.svg';
import FloorPlanImage from '../../../../../../assets/images/floorPlan.svg';
import Modal from '../../../../../../components/common/Modal';
import { useUpdateProjectInformationMutation } from '../../../../../../store/projects';
import { useSelector } from '../../../../../../store';
import useCreateProject from '../../../../../../hooks/useCreateProject';

const FloorPlan = () => {
  const { selectedProject, createProjectStep: activeStep } = useSelector((state) => state.project);

  const [selectedPlan, setSelectedPlan] = useState<string>(selectedProject.floor_plan);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const { goNextStep, setStep } = useCreateProject();

  useEffect(() => {
    setStep(2);
  }, []);

  function onFloorPlanSelect(id: string) {
    if (selectedPlan === id) {
      setSelectedPlan('');
    } else {
      setSelectedPlan(id);
    }
  }

  const [updateProject] = useUpdateProjectInformationMutation();

  async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedPlan) {
      await updateProject({ formData: { floor_plan: selectedPlan }, id: selectedProject.id });
    } else {
      await updateProject({ formData: { floor_plan: null }, id: selectedProject.id });
    }
    goNextStep();
  }

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        title="Floor plans"
        button={<p>Got it</p>}
        onClose={() => setModalIsOpen(false)}
        onButtonClick={() => setModalIsOpen(false)}
      >
        <div className="flex justify-center mt-10 p-8">
          <div className="relative w-[fit-content] text-[#788398]">
            <FloorPlanImage className="relative" />
            <span className="absolute top-[3.5rem] left-[3rem] cursor-vertical-text text transform -rotate-90">
              BATHROOM
            </span>
            <span className="absolute top-[12.5rem] left-[5rem] cursor-vertical-text text transform -rotate-90">
              KITCHEN
            </span>
            <span className="absolute top-[10.5rem] left-[10.5rem]">LIVING ROOM</span>
            <span className="absolute top-[12.5rem] right-[2.5rem] cursor-vertical-text text transform -rotate-90">
              BEDROOM
            </span>
            <span className="absolute top-[4.5rem] right-[1.5rem] cursor-vertical-text text transform -rotate-90">
              BEDROOM
            </span>
          </div>
        </div>
        <p className="mt-9 text-start px-10">
          A floor plan serves as a common reference point for all parties involved in the renovation project. It enables
          effective communication between homeowners, contractors, architects, and designers. With a clear visual
          representation of the planned changes, everyone can align their understanding of the project scope, minimize
          misunderstandings, and work together towards a shared vision.
        </p>
      </Modal>
      <form id={activeStep.toString()} onSubmit={submitHandler}>
        <div>
          <h4 className="text-2xl text-main-secondary font-bold font-montserrat">Floor Plan</h4>
          <p className="font-bold mt-[54px]">Create floor plan (optional)</p>
          <div className="flex flex-col lg:flex-row gap-3 mt-9">
            <Selection
              id="own"
              onSelect={onFloorPlanSelect}
              selected={selectedPlan}
              header={<p>Design my floor plan</p>}
              description="Design and arrange your floor plan, furniture, and measurements effortlessly with our visualization tool."
              icon={<FloorPlanIcon className="fill-main-primary" />}
            />
            <Selection
              onSelect={onFloorPlanSelect}
              selected={selectedPlan}
              id="designer"
              header={<p>Connect with Designer</p>}
              description="This option offers you the opportunity to collaborate with a professional designer who can bring your home project to life."
              icon={<PenIcon className="stroke-main-primary stroke-2" />}
            />
          </div>
          <div
            onClick={() => setModalIsOpen(true)}
            className="flex gap-2 font-bold text-main-primary mt-5 hover:cursor-pointer w-[fit-content]"
          >
            <div>
              <InfoIcon className="fill-main-primary" />
            </div>
            Learn more about floor plans.
          </div>
        </div>
      </form>
    </>
  );
};

export default FloorPlan;
