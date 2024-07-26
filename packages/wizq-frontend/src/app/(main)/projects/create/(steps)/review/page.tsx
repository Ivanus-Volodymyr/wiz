'use client';

import React, { useEffect, useState } from 'react';
import FlagIcon from '../../../../../../assets/icons/flag.svg';
import ImageIcon from '../../../../../../assets/icons/Icons=Image.svg';
import LayersIcon from '../../../../../../assets/icons/layers.svg';
import BriefCaseIcon from '../../../../../../assets/icons/briefcase.svg';
import CreditCardIcon from '../../../../../../assets/icons/credit-card.svg';
import { FileType } from '../../../../../../types';
import FloorPlanIcon from '../../../../../../assets/icons/Icons=Floor plan.svg';
import PenIcon from '../../../../../../assets/icons/Icons=Pen.svg';
import { useSelector } from '../../../../../../store';
import AppLink from '../../../../../../components/common/AppLink';
import DocumentIcon from '../../../../../../assets/icons/Icons=document, Property 1=Variant55.svg';
import Link from 'next/link';
import useCreateProject from '../../../../../../hooks/useCreateProject';

const ReviewProject = () => {
  const [isFilesExpanded, setIsFilesExpanded] = useState(false);
  const { selectedProject, createProjectStep: activeStep } = useSelector((state) => state.project);

  const { goNextStep, setStep } = useCreateProject();

  useEffect(() => {
    setStep(5);
  }, []);

  function editStepHandler(step: number) {
    setStep(step);
  }

  function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    goNextStep();
  }

  return (
    <form id={activeStep.toString()} onSubmit={submitHandler}>
      <h4 className="text-2xl text-main-secondary font-bold font-montserrat">Review your project</h4>
      <div className="border-2 border-[#CDD6EC] border-b-0 mt-12">
        <div className="p-7 border-b-2 border-[#CDD6EC] pb-[100px]">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <FlagIcon />
              <p className="text-2xl font-medium font-montserrat">Project</p>
            </div>
            <span className="text-main-primary font-medium cursor-pointer" onClick={() => editStepHandler(1)}>
              Edit
            </span>
          </div>
          <div className="mt-10">
            <p>Project title</p>
            <p className="font-bold">{selectedProject.name}</p>
          </div>
          {selectedProject.description && (
            <div className="mt-10">
              <p>Description</p>
              <p className="font-medium text-sm px-8 py-5">{selectedProject.description}</p>
            </div>
          )}
          <div className="mt-10">
            <p>Project address</p>
            <p className="font-bold">{selectedProject.address}</p>
          </div>
          <div className="mt-10">
            <p>Documents</p>
            <AppLink
              color="primary"
              className="font-medium"
              onClick={() => setIsFilesExpanded((prevState) => !prevState)}
            >
              {selectedProject.files?.length || 0} images uploaded
            </AppLink>
            {selectedProject.files?.length > 0 && isFilesExpanded ? (
              <div className="flex flex-col mt-6 gap-4">
                {(selectedProject?.files as FileType[]).map((item) => (
                  <div className="flex gap-2 items-center" key={item.id}>
                    <div>
                      <DocumentIcon className="stroke-main-secondary" />
                    </div>
                    <p>
                      <Link target="_blank" href={item.fileUrl}>
                        <AppLink color="primary" className="font-bold">
                          {item.originalName.split('.')[0]}
                        </AppLink>
                      </Link>
                      .{item.originalName.split('.')[1]}({item.size / 1000}kb)
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-1 py-2 mt-6 flex gap-4">
                {(selectedProject.files as FileType[])?.map((item) => (
                  <div key={item.id}>
                    <ImageIcon className="fill-main-secondary scale-[2]" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-10">
            <p>Project categories</p>
            <div className="flex flex-wrap mt-2 gap-2">
              {selectedProject.categories?.map((item) => (
                <div className="font-bold p-2 bg-[#E6F2FF]" key={item.id}>
                  {item.name}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10">
            <p>Start date</p>
            <p className="font-bold">{selectedProject.start_date}</p>
          </div>
          <div className="mt-[75px] flex flex-row justify-between items-center">
            <div>
              <p>Dimension</p>
              <p className="font-bold">
                {selectedProject.dimensions.result.toLocaleString('en')}ft<sup>2</sup>
              </p>
            </div>
            <div>
              <p>Visibility</p>
              <p className="font-bold">{selectedProject.is_private ? 'Private' : 'Public'}</p>
            </div>
          </div>
        </div>
        <div className="p-7 border-b-2 border-[#CDD6EC]">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <LayersIcon />
              <p className="text-2xl font-medium font-montserrat">Floor plan</p>
            </div>
            <span className="text-main-primary font-medium cursor-pointer" onClick={() => editStepHandler(2)}>
              Edit
            </span>
          </div>
          {selectedProject.floor_plan && (
            <div className="mt-10">
              <div className="px-8 py-5 text-center">
                <div className="px-6 py-9 bg-[#E6F2FF]">
                  {selectedProject.floor_plan === 'designer' && (
                    <>
                      <div className="flex gap-4 items-center justify-center">
                        <div>
                          <PenIcon className="stroke-main-primary stroke-2" />
                        </div>
                        <p className="font-bold">You chose to connect with a designer</p>
                      </div>
                      <p className="text-sm mt-2">
                        After saving your project, we will show you a list of designers to connect with
                      </p>
                    </>
                  )}
                  {selectedProject.floor_plan === 'own' && (
                    <>
                      <div className="flex gap-4 items-center justify-center">
                        <div>
                          <FloorPlanIcon className="fill-main-primary" />
                        </div>
                        <p className="font-bold">You chose to design your own floor plan</p>
                      </div>
                      <p className="text-sm mt-2">
                        After saving your project, we’ll provide you with the tools to design your unique floor plan
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-7 border-b-2 border-[#CDD6EC] pb-[100px]">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <BriefCaseIcon className="stroke-main-primary" />
              <p className="text-2xl font-medium font-montserrat">Service provider</p>
            </div>
            <span className="text-main-primary font-medium cursor-pointer" onClick={() => editStepHandler(3)}>
              Edit
            </span>
          </div>
          <div className="mt-10">
            <p>Skill level</p>
            <p className="font-bold">{selectedProject.skill_level}</p>
          </div>
          <div className="mt-10">
            <p>Skills</p>
            <div className="flex flex-wrap mt-2 gap-2">
              {selectedProject.skills?.map((item) => (
                <div className="font-bold p-2 bg-[#E6F2FF]" key={item.id}>
                  {item.name}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10">
            <p>Tasks</p>
            <div className="flex flex-wrap mt-2 gap-2">
              {selectedProject.project_tasks?.map((item, index) => (
                <div className="font-bold p-2 border-b-2 border-[#CDD6EC] w-full" key={item.id}>
                  <div className="flex gap-6 items-center">
                    <div className="py-1 px-3 bg-[#E0ECF8] w-8 flex justify-center">{index + 1}</div>
                    <p>{item.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-7 border-b-2 border-[#CDD6EC] pb-[100px]">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <CreditCardIcon className="stroke-main-primary" />
              <p className="text-2xl font-medium font-montserrat">Budget</p>
            </div>
            <span className="text-main-primary font-medium cursor-pointer" onClick={() => editStepHandler(4)}>
              Edit
            </span>
          </div>
          <div className="mt-10">
            <p>Budget range</p>
            <p className="font-bold">
              ${Number(selectedProject?.min_budget).toLocaleString('en')} - $
              {Number(selectedProject?.max_budget).toLocaleString('en')}
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ReviewProject;
