'use client';

import React, { useEffect } from 'react';
import AppRangeSlider from '../../../../../../components/common/RangeSlider';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from '../../../../../../store';
import { useUpdateProjectInformationMutation } from '../../../../../../store/projects';
import useCreateProject from '../../../../../../hooks/useCreateProject';

type BudgetFormData = { budget_range: number[] };

const Budget = () => {
  const { selectedProject, createProjectStep: activeStep } = useSelector((state) => state.project);

  const { goNextStep, setStep } = useCreateProject();

  useEffect(() => {
    setStep(4);
  }, []);

  const defaultValues: BudgetFormData = {
    budget_range: [parseFloat(selectedProject.min_budget), parseFloat(selectedProject.max_budget)] || [1, 2000000],
  };

  const budgetSchema = yup.object<BudgetFormData>({
    budget_range: yup
      .array()
      .of(
        yup
          .number()
          .min(1, 'The minimum value cannot be less than 1')
          .max(2000000, 'The maximum value cannot be more than 2000000')
      ),
  });

  const methods = useForm<BudgetFormData>({
    defaultValues,
    resolver: yupResolver(budgetSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const budgetRangeErrors = errors.budget_range as unknown as { message: string }[];

  const errorMessage = (): string => {
    if (budgetRangeErrors) {
      if (Array.isArray(budgetRangeErrors)) {
        return budgetRangeErrors[0]?.message || budgetRangeErrors[1]?.message;
      }
    }
    return '';
  };

  const [updateProject] = useUpdateProjectInformationMutation();

  async function submitFormHandler(data: BudgetFormData) {
    const budgetData = {
      min_budget: data.budget_range[0].toString(),
      max_budget: data.budget_range[1].toString(),
    };
    await updateProject({ formData: budgetData, id: selectedProject.id });
    goNextStep();
  }

  return (
    <FormProvider {...methods}>
      <form id={activeStep.toString()} onSubmit={handleSubmit(submitFormHandler)}>
        <h4 className="text-2xl text-main-secondary font-bold font-montserrat">Budget</h4>
        <div className="mt-8">
          <p className="font-bold">Set budget range</p>
          <p>Given the information and project location, the expected cost is typically below;</p>
          <div className="mt-[72px]">
            <Controller
              control={control}
              name="budget_range"
              render={({ field }) => (
                <AppRangeSlider
                  error={errorMessage()}
                  rangeUnit="$"
                  maxValue={2000000}
                  minValue={1}
                  minLabel="MIN PRICE"
                  maxLabel="MAX PRICE"
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

export default Budget;
