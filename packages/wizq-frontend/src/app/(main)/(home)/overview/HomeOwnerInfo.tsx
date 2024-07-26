import React from 'react';
import Button from '../../../../components/common/Button';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from '../../../../store';
import { logout, resetSelectedProjectState, setIsReviewing } from '../../../../store/projects';
import PlusIcon from '../../../../assets/icons/Icons=Plus.svg';
import useCreateProject from '../../../../hooks/useCreateProject';

const HomeOwnerInfo = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  const { setStep } = useCreateProject();

  const createNewProjectClickHandler = () => {
    setStep(1);
    router.push('/projects/create');
    dispatch(resetSelectedProjectState());
    dispatch(setIsReviewing(false));
  };

  function logoutHandler() {
    dispatch(logout());
  }

  const goToAllProjectsHandler = () => {
    router.push('/projects');
  };

  return (
    <>
      <h3 className="font-montserrat lg:text-4xl">Welcome, {user.firstName || user.email}</h3>
      <div className="flex flex-col gap-2">
        <Button color="primary" onClick={goToAllProjectsHandler}>
          All projects
        </Button>
        <Button type="button" onClick={createNewProjectClickHandler} color="primary">
          Create new project
          <div>
            <PlusIcon className="fill-accent-white" />
          </div>
        </Button>
        <Button color="secondary" onClick={logoutHandler}>
          Logout
        </Button>
      </div>
    </>
  );
};

export default HomeOwnerInfo;
