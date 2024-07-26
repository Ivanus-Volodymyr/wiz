import React, { useState } from 'react';
import ManageSPsHeader from './ManageSPsHeader';
import { MANAGE_SP_TABS } from '../../../../utils/projectInformation';
import ManageSPsContent from './ManageSPsContent';
import { useGetSelectedProjectQuery } from '../../../../store/projects';
import { useSelector } from '../../../../store';

type Props = {
  projectId: string;
};

const ManageSPs = ({ projectId }: Props) => {
  const { manageSPTab } = useSelector((state) => state.project);
  const { data: project } = useGetSelectedProjectQuery(projectId);

  const [activeTab, setActiveTab] = useState<typeof MANAGE_SP_TABS[number]>(manageSPTab);

  return (
    <div className="xl:flex-1 border-[1px] xl:border-l-0 h-[max-content] border-border-default">
      <ManageSPsHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <ManageSPsContent project={project} activeTab={activeTab} />
    </div>
  );
};

export default ManageSPs;
