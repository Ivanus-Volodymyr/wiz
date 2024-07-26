import React from 'react';
import Button from '../../../../components/common/Button';
import { useDispatch, useSelector } from '../../../../store';
import { logout } from '../../../../store/projects';

const ServiceProviderInfo = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  function logoutHandler() {
    dispatch(logout());
  }

  return (
    <>
      <h3 className="font-montserrat lg:text-4xl">Welcome, {user.firstName || user.email}</h3>
      <div className="flex flex-col gap-2">
        <Button color="secondary" onClick={logoutHandler}>
          Logout
        </Button>
      </div>
    </>
  );
};

export default ServiceProviderInfo;
