'use client';

import React, { useEffect, useMemo } from 'react';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ServiceProviderData } from '../../../../../../types/project';
import RadioGroup from '../../../../../../components/common/RadioGroup';
import { SKILL_LEVEL_OPTIONS } from '../../../../../../utils/createProject';
import SearchIcon from '../../../../../../assets/icons/Icons=Search.svg';
import MultiSelect from '../../../../../../components/common/MultiSelect';
import DragNDropList from '../../../../../../components/common/DragNDropList';
import { useSelector } from '../../../../../../store';
import {
  useGetSkillsQuery,
  useCreateSuggestedSkillsMutation,
  useUpdateProjectInformationMutation,
} from '../../../../../../store/projects';
import useCreateProject from '../../../../../../hooks/useCreateProject';

const ServiceProvider = () => {
  const { selectedProject, suggestedSkills, createProjectStep: activeStep } = useSelector((state) => state.project);

  const { data: skills } = useGetSkillsQuery(null);
  const [getSuggestedSkills] = useCreateSuggestedSkillsMutation();

  const { goNextStep, setStep } = useCreateProject();

  useEffect(() => {
    setStep(3);
  }, []);

  const defaultValues: ServiceProviderData = useMemo(
    () => ({
      skill_level: selectedProject.skill_level || '',
      project_tasks: selectedProject.project_tasks || [],
      skills: selectedProject.skills || [],
    }),
    [selectedProject]
  );

  const projectInformationSchema = yup.object({
    skill_level: yup.string().required('Please select one skill level'),
    project_tasks: yup.array().min(1, 'Please add at least one task for the service provider.'),
    skills: yup.array().min(1, 'Please add at least one skill'),
  });

  const methods = useForm<ServiceProviderData>({
    defaultValues,
    resolver: yupResolver(projectInformationSchema),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const [updateProject] = useUpdateProjectInformationMutation();

  async function submitFormHandler(data: ServiceProviderData) {
    await updateProject({ formData: data, id: selectedProject.id });
    goNextStep();
  }

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (!selectedProject.skills.length) {
      void getSuggestedSkills(selectedProject.description);
    }
  }, [getSuggestedSkills, selectedProject.description, selectedProject.skills.length]);

  return (
    <FormProvider {...methods}>
      <form id={activeStep.toString()} onSubmit={handleSubmit(submitFormHandler)}>
        <h4 className="text-2xl text-main-secondary font-bold font-montserrat">Service provider</h4>
        <div className="mt-11">
          <Controller
            control={control}
            name="skill_level"
            render={({ field }) => (
              <RadioGroup
                options={SKILL_LEVEL_OPTIONS}
                label="Select provider skill level"
                error={errors.skill_level?.message || ''}
                {...field}
              />
            )}
          />
          <div className="mt-20">
            <Controller
              control={control}
              name="skills"
              render={({ field }) => (
                <MultiSelect
                  error={errors.skills?.message || ''}
                  label="Skills"
                  startIcon={<SearchIcon />}
                  placeholder="Search or enter skills"
                  options={skills || []}
                  suggested={<p className="text-base text-[#0D1835]">Suggested skills</p>}
                  suggestedOptions={suggestedSkills}
                  {...field}
                />
              )}
            />
          </div>
          <div className="mt-20">
            <Controller
              control={control}
              name="project_tasks"
              render={({ field }) => (
                <DragNDropList
                  error={errors.project_tasks?.message || ''}
                  addText="Add task"
                  label="Add task for service provider"
                  {...field}
                />
              )}
            />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default ServiceProvider;
