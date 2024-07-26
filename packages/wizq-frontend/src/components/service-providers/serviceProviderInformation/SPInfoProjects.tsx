import React from 'react';
import AppLink from '../../common/AppLink';
import SPProjectItem from './SPProjectItem';
import { BusinessResponse } from '../../../types/business';

type Props = {
  provider: BusinessResponse;
};

const SpInfoProjects = ({ provider }: Props) => {
  return (
    <div id="projects" className="py-18">
      <div className="flex justify-between items-center">
        <h3 className="font-montserrat text-4xl">Featured projects</h3>
        <AppLink className="font-medium" color="secondary">
          View all
        </AppLink>
      </div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-9 gap-y-28">
        {provider?.businessProjects &&
          provider?.businessProjects?.slice(0, 7).map((item, index) => <SPProjectItem project={item} key={index} />)}
      </div>
    </div>
  );
};

export default SpInfoProjects;
