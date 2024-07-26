import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { BusinessProjectType } from '../../types/business';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import MultiSelect from '../common/MultiSelect';
import {
  useCreateBusinessProjectMutation,
  useDeleteFileByIdMutation,
  useUpdateBusinessProjectMutation,
  useGetCategoriesQuery,
} from '../../store/projects';

import IconInfo from '../../assets/icons/Icons=Info-Cirlce.svg';
import FileUpload from '../common/FileUpload';
import Button from '../common/Button';
import { Option, FileType } from '../../types';

interface BusinessProjectModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  project: BusinessProjectType;
  setProject: React.Dispatch<React.SetStateAction<BusinessProjectType>>;
  refetch: any;
  status: string;
  businessId: string;
}

export default function BusinessProjectModal({
  modal,
  setModal,
  project,
  setProject,
  refetch,
  status,
  businessId,
}: BusinessProjectModalProps) {
  const { data: categories } = useGetCategoriesQuery();
  const [createBusinessProject] = useCreateBusinessProjectMutation();
  const [updateBusinessProject] = useUpdateBusinessProjectMutation();
  const [deleteFileById] = useDeleteFileByIdMutation();

  const [addressOptions, setAddressOptions] = useState<string[]>([]);
  const [originalFiles, setOriginalFiles] = useState<File[]>([]);

  const schema = yup.object({
    name: yup
      .string()
      .required('This is a required field.')
      .matches(
        /^[A-Z][a-zA-Z0-9~!@#$%^&*()-_=+\/?|{};:'",.<>]/,
        'Please enter a valid name. Valid name includes uppercase and lowercase letters of the alphabet, numeric characters 0 through 9, and the special characters, it must begin with an uppercase letter of the alphabet.'
      )
      .test('', 'This is a required field.', (value: string) => {
        if (value.trim() === '') return false;
        return true;
      }),
    location: yup.string().required('This is a required field.'),
    businessCategories: yup
      .array()
      .required('This is a required field.')
      .min(1, 'Please select one or more categories.'),
  });

  const methods = useForm<BusinessProjectType>({
    defaultValues: {
      name: '',
      location: '',
      businessCategories: [],
      files: [],
    },
    resolver: yupResolver(schema),
    resetOptions: { keepIsSubmitted: true },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    setValue,
    clearErrors,
    reset,
  } = methods;

  useEffect(() => {
    const cats = categories as unknown as Option[];

    const tmpCategories = cats?.filter((rs) => {
      return project?.businessCategories?.find((f) => f.categoryId === rs.id);
    });

    const resCategory: Option[] = tmpCategories?.map((rs) => {
      return {
        id: rs.id,
        name: rs.name,
      };
    });

    reset();
    setValue('name', project?.name.trim() || '');
    setValue('location', project?.location || '');
    setValue('businessCategories', resCategory || []);
    setValue('files', project?.files || []);
  }, [project, modal]);

  async function changeAddressInputHandler(input: string) {
    if (input === '') {
      setAddressOptions([]);
      return;
    }
    const addresses = await new google.maps.places.AutocompleteService().getPlacePredictions({ input });
    setAddressOptions(addresses.predictions.map((item) => item.description));
  }

  const handleDeleteFile = async (fileId: string) => {
    const resData = (await deleteFileById({ id: fileId })) as { data: undefined };

    if (resData) {
      refetch();
      setValue('files', resData?.data as FileType[] | []);
    }
  };

  const handleCancel = () => {
    setModal(false);
    clearErrors();
    setOriginalFiles([]);
    setProject(null);
    reset();
  };

  const handlerSubmit = async (data: BusinessProjectType) => {
    let resData = null;

    if (status === 'create') {
      resData = await createBusinessProject({ ...data, name: data.name, businessId, files: originalFiles });
    } else {
      resData = await updateBusinessProject({ ...data, name: data.name, files: originalFiles, id: project?.id });
    }

    if (resData?.data) {
      refetch();
      setModal(false);
      setOriginalFiles([]);
      setProject(null);
      reset();
    }
  };

  return (
    <Modal isOpen={modal} onClose={handleCancel}>
      <div className="mt-[10px] p-8">
        <p className="text-6 text-[#0D1835] font-bold font-montserrat mb-16">
          {status === 'create' ? 'Add project' : 'Update project'}
        </p>
        <FormProvider {...methods}>
          <form id="addProject" onSubmit={handleSubmit(handlerSubmit)}>
            <div className="mb-2 text-start">
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    id="project-name"
                    error={errors.name?.message || ''}
                    isSubmitted={isSubmitted}
                    className="w-full font-medium max-w-full"
                    label="Project name"
                    placeholder="Enter project name"
                    {...field}
                  />
                )}
              />
            </div>
            <div className="mb-2 text-start">
              <Controller
                control={control}
                name="location"
                render={({ field }) => (
                  <Select
                    error={errors.location?.message || ''}
                    onAddressValidation={changeAddressInputHandler}
                    label="Project Location"
                    id="project-location"
                    placeholder="Enter state and city for this project"
                    className="w-full"
                    options={addressOptions}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="mb-2 text-start">
              <div className="mb-3">
                <Controller
                  control={control}
                  name="businessCategories"
                  render={({ field }) => (
                    <MultiSelect
                      error={errors.businessCategories?.message || ''}
                      label="Project category"
                      placeholder="Select categories"
                      options={categories || []}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="flex items-center">
                <div>
                  <IconInfo className="fill-main-primary" />
                </div>
                <p className="text-label-disable text-sm ml-2">
                  Assists homeowners in discovering your project when searching for the style they like.
                </p>
              </div>
            </div>
            <div className="mb-10 text-start">
              <label className="font-bold">Upload images (optional)</label>
              <Controller
                control={control}
                name="files"
                render={({ field }) => (
                  <FileUpload
                    onFileDelete={handleDeleteFile}
                    className="mt-7"
                    originalFiles={originalFiles}
                    setOriginalFiles={setOriginalFiles}
                    extension="images"
                    helperMessage="*.png, *.jpg, *.jpeg and *.gif (max size: 3MB, max quantity: 5)"
                    {...field}
                  />
                )}
              />
            </div>
            <div className="flex items-center justify-between flex-col md:flex-row gap-5 w-full">
              <Button className="w-full md:w-[30%]" color="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button className="w-full md:w-[60%]" color="primary" form="addProject" type="submit">
                Save
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Modal>
  );
}
