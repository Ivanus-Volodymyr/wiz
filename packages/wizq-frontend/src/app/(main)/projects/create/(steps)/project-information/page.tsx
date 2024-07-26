'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Input from '../../../../../../components/common/Input';
import SearchIcon from '../../../../../../assets/icons/Icons=Search.svg';
import Plus from '../../../../../../assets/icons/Icons=Plus.svg';
import DeclineIcon from '../../../../../../assets/icons/Icons=Times.svg';
import IconButton from '../../../../../../components/common/IconButton';
import Select from '../../../../../../components/common/Select';
import LocationIcon from '../../../../../../assets/icons/Icons=location, Property 1=Variant55.svg';
import FileUpload from '../../../../../../components/common/FileUpload';
import MultiSelect from '../../../../../../components/common/MultiSelect';
import ToggleRounded from '../../../../../../components/common/ToggleRounded';
import LockedIcon from '../../../../../../assets/icons/Icons=lock, Property 1=Variant55.svg';
import { Controller, type FieldPath, FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { number } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ProjectInformationData } from '../../../../../../types/project';
import DimensionsInput from './DimensionsInput';
import { START_DATE_OPTIONS } from '../../../../../../utils/createProject';
import CalendarIcon from '../../../../../../assets/icons/Icons=Calendar.svg';
import {
  useCreateNewProjectMutation,
  useDeleteFileFromProjectMutation,
  useGetCategoriesQuery,
  useGetMeQuery,
  useUpdateProjectInformationMutation,
} from '../../../../../../store/projects';
import { useSelector } from '../../../../../../store';
import { useCreateUserAddressMutation } from '../../../../../../store/users';
import { isValidProjectStartingDate } from '../../../../../../utils/formatTime';
import AppLink from '../../../../../../components/common/AppLink';
import useCreateProject from '../../../../../../hooks/useCreateProject';

const ProjectInformation = () => {
  const { data: myUser, refetch: refetchMyUser } = useGetMeQuery({});
  const userAddresses = myUser?.addresses?.map((item) => item.name) || [];

  const { data: categories } = useGetCategoriesQuery();
  const [descriptionActive, setDescriptionActive] = useState<boolean>(false);
  const { selectedProject, createProjectStep: activeStep } = useSelector((state) => state.project);
  const [startDateOptions, setStartDateOptions] = useState<string[]>(START_DATE_OPTIONS);
  const [addressOptions, setAddressOptions] = useState<string[]>(userAddresses);
  const [originalFiles, setOriginalFiles] = useState<File[]>([]);

  const { goNextStep, setStep } = useCreateProject();

  useEffect(() => {
    setStep(1);
  }, []);

  async function changeAddressInputHandler(input: string) {
    if (input === '') {
      setAddressOptions(userAddresses);
      return;
    }
    const filteredUserAddresses = userAddresses.filter((item) => item.includes(input));
    const addresses = await new google.maps.places.AutocompleteService().getPlacePredictions({ input });
    setAddressOptions([...addresses.predictions.map((item) => item.description), ...filteredUserAddresses]);
  }

  function changeDescriptionActiveHandler() {
    setDescriptionActive((prevState) => !prevState);
  }

  const defaultValues: ProjectInformationData = useMemo(
    () => ({
      files: selectedProject.files || [],
      name: selectedProject.name?.trim() || '',
      description: selectedProject.description?.trim() || '',
      address: selectedProject.address || '',
      categories: selectedProject.categories || [],
      dimensions: selectedProject.dimensions,
      start_date: selectedProject.start_date || '',
      is_private: selectedProject.is_private,
    }),
    [selectedProject]
  );

  const projectInformationSchema = yup.object({
    name: yup
      .string()
      .required('Please add your project’s title.')
      .test('', 'Please add your project’s title.', (value: string) => {
        if (value.trim() === '') return false;
        return true;
      })
      .matches(/^(?!.*([A-Z][a-z]*[A-Z]|\s\s))[A-Z].*$/, 'Please add correct project’s title.'),
    address: yup.string().required('Please enter the location of the project.'),
    categories: yup
      .array()
      .required('Please select one or more categories')
      .min(1, 'Please select one or more categories'),
    dimensions: yup.object({
      length: number().required().min(1),
      width: number().required().min(1),
      unit: number(),
      result: number(),
    }),
    start_date: yup
      .string()
      .required('Please select the start date')
      .test('futureDateOrOption', 'Invalid start date', (value) => {
        return isValidProjectStartingDate(value);
      }),
  });

  const methods = useForm<ProjectInformationData>({
    defaultValues,
    resolver: yupResolver(projectInformationSchema),
  });

  const {
    reset,
    resetField,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = methods;

  const [createProject] = useCreateNewProjectMutation();
  const [createUserAddress] = useCreateUserAddressMutation();
  const [updateProject] = useUpdateProjectInformationMutation();
  const [deleteFileFromProject] = useDeleteFileFromProjectMutation();

  async function submitFormHandler(data: ProjectInformationData) {
    if (selectedProject.id) {
      await updateProject({
        formData: { ...data, name: data.name.trim(), description: data.description.trim(), files: originalFiles },
        id: selectedProject.id,
      });
    } else {
      const res = await createProject({
        ...data,
        name: data.name.trim(),
        description: data.description.trim(),
        files: originalFiles,
      });
      if ('error' in res) return;
    }
    goNextStep();
  }

  async function addNewAddressHandler(address: string) {
    try {
      await createUserAddress({ userId: myUser.id, addressName: address });
      await refetchMyUser();
      userAddresses.push(address);
      setAddressOptions([address]);
    } catch (e) {}
  }

  function addNewStartDateOptionHandler(value: string) {
    if (startDateOptions.includes(value)) return;
    setStartDateOptions((prevState) => [...prevState, value]);
  }

  async function deleteFileHandler(fileId: string) {
    await deleteFileFromProject(fileId);
  }

  useEffect(() => {
    resetField('files' as FieldPath<ProjectInformationData>, { defaultValue: defaultValues.files });
    if (selectedProject.name) {
      reset(defaultValues);
    }
  }, [resetField, defaultValues.files, reset, defaultValues, selectedProject.name]);

  useEffect(() => {
    if (selectedProject.description) {
      setDescriptionActive(true);
    }
  }, [selectedProject]);

  return (
    <FormProvider {...methods}>
      <form id={activeStep.toString()} onSubmit={handleSubmit(submitFormHandler)}>
        <input {...register('authorId' as FieldPath<ProjectInformationData>)} type="hidden" />
        <h4 className="text-2xl text-main-secondary font-bold font-montserrat">Project information</h4>
        <div className="mt-11">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                id="project-name"
                error={errors.name?.message || ''}
                isSubmitted={isSubmitted}
                className="w-full font-medium"
                label="What's the name of your awesome project?"
                placeholder="E.g. Modernizing a 1950s kitchen to open floorplan"
                helperMessage="Using a descriptive project title will make it more visible to high quality service providers"
                {...field}
              />
            )}
          />
          <div
            onClick={changeDescriptionActiveHandler}
            className="mt-8 flex items-center cursor-pointer max-w-[max-content]"
          >
            <IconButton
              type="button"
              icon={
                descriptionActive ? (
                  <DeclineIcon className="fill-accent-white" />
                ) : (
                  <Plus className="fill-accent-white" />
                )
              }
            />
            {!descriptionActive && (
              <p className="font-bold">
                <AppLink color="primary" className="text-main-primary">
                  Add description
                </AppLink>{' '}
                (optional)
              </p>
            )}
          </div>
          {descriptionActive && (
            <div className="mt-4">
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <Input
                    textarea={true}
                    id="project-description"
                    className="w-full font-medium"
                    label="Add project description"
                    placeholder="My project description"
                    {...field}
                  />
                )}
              />
            </div>
          )}
          <div className="mt-20">
            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <Select
                  onAddressValidation={changeAddressInputHandler}
                  onAddNew={addNewAddressHandler}
                  addNewText="Add another address"
                  label="Choose address for this project"
                  id="select-project-location"
                  placeholder="Select project address/location"
                  className="w-full"
                  startIcon={<LocationIcon className="stroke-main-secondary" />}
                  error={errors.address?.message || ''}
                  helperMessage="Your address will help us determine contractor match, as well as pricing and local taxes."
                  options={addressOptions || []}
                  {...field}
                />
              )}
            />
          </div>
          <div className="mt-20">
            <label className="font-bold">Upload images (optional)</label>
            <Controller
              control={control}
              name="files"
              render={({ field }) => (
                <FileUpload
                  onFileDelete={deleteFileHandler}
                  originalFiles={originalFiles}
                  setOriginalFiles={setOriginalFiles}
                  className="mt-7"
                  extension="images"
                  helperMessage="*.png, *.jpg, *.jpeg and *.gif (max size: 3MB, max quantity: 5)"
                  {...field}
                />
              )}
            />
          </div>
          <div className="mt-20">
            <Controller
              control={control}
              name="categories"
              render={({ field }) => (
                <MultiSelect
                  error={errors.categories?.message || ''}
                  label="Add project category"
                  startIcon={<SearchIcon />}
                  placeholder="Search category"
                  options={categories || []}
                  suggested={<p className="text-base text-[#0D1835] font-bold">Suggested categories</p>}
                  {...field}
                />
              )}
            />
          </div>
          <div className="mt-20">
            <Controller
              control={control}
              name="dimensions"
              render={({ field }) => (
                <DimensionsInput
                  error={
                    errors.dimensions?.message ||
                    errors.dimensions?.length?.message ||
                    errors.dimensions?.width?.message ||
                    ''
                  }
                  {...field}
                />
              )}
            />
          </div>
          <div className="mt-20">
            <Controller
              control={control}
              name="start_date"
              render={({ field }) => (
                <Select
                  addNewInputType="date"
                  label="When would you like this project to start?"
                  onAddNew={addNewStartDateOptionHandler}
                  addNewText="Add preferred start date"
                  id="select-project-start-date"
                  placeholder="Select project start date"
                  className="w-full"
                  startIcon={<CalendarIcon />}
                  error={errors.start_date?.message || ''}
                  options={startDateOptions}
                  {...field}
                />
              )}
            />
          </div>
          <div className="mt-20">
            <Controller
              control={control}
              name="is_private"
              render={({ field }) => (
                <ToggleRounded
                  startIcon={<LockedIcon className="stroke-main-secondary" />}
                  label="Make private"
                  valueText="When a project is set to private, it can only be viewed or joined by an invitation."
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

export default ProjectInformation;
