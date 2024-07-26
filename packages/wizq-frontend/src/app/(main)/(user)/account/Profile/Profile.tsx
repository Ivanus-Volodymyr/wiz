import React from 'react';
import { Address, PersonalInformation, ProfileInformation } from './index';

const Profile = () => {
  return (
    <>
      <ProfileInformation />
      <PersonalInformation />
      <Address />
    </>
  );
};

export default Profile;
