import { useEffect } from 'react';
import { useDispatch, useSelector } from '../store';
import { useRouter } from 'next/navigation';
import { setCreateProjectStep, setIsReviewing } from '../store/projects';

const useCreateProject = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const setActiveStep = (step: number) => {
    dispatch(setCreateProjectStep(step));
  };
  const { selectedProject, createProjectStep: activeStep, isReviewing } = useSelector((state) => state.project);

  const goNextStep = () => {
    if (isReviewing && activeStep !== 5) {
      setActiveStep(5);
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const goBackStep = () => {
    if (activeStep === 1) {
      router.replace('/overview');
      return;
    }

    dispatch(setIsReviewing(false));
    setActiveStep(activeStep - 1);
  };

  const setStep = (step: number) => {
    setActiveStep(step);
  };

  useEffect(() => {
    if (activeStep === 5) {
      dispatch(setIsReviewing(true));
    }
  }, [activeStep, dispatch, selectedProject.floor_plan]);

  return { goNextStep, goBackStep, setStep };
};

export default useCreateProject;
