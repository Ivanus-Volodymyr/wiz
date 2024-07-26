import React from 'react';
import { MANAGE_SP_TABS } from '../../../../utils/projectInformation';
import ManageSPsProposalsList from './ManageSPsProposalsList';
import { useDispatch, useSelector } from '../../../../store';
import ManageSPsMatchedList from './ManageSPsMatchedList';
import { LoadProjectResponse } from '../../../../types/project';
import ManageSPsContactedList from './ManageSPsContactedList';
import ProposalDetails from './proposals/ProposalDetails';
import { setSelectedProposal } from '../../../../store/projects';

type Props = {
  activeTab: (typeof MANAGE_SP_TABS)[number];
  project: LoadProjectResponse;
};

const ManageSPsContent = ({ activeTab, project }: Props) => {
  const dispatch = useDispatch();
  const { selectedProject, selectedProposal } = useSelector((state) => state.project);

  const openedProposal = selectedProject?.proposals.find((item) => item.id === selectedProposal);

  return (
    <>
      {selectedProposal && (
        <>
          <div
            onClick={() => dispatch(setSelectedProposal(null))}
            className="fixed top-0 left-0 z-[51] h-full w-full bg-main-secondary opacity-30"
          ></div>
          <ProposalDetails proposal={openedProposal} onClose={() => dispatch(setSelectedProposal(null))} />
        </>
      )}
      <div className="p-8">
        {activeTab === 'Proposals' && <ManageSPsProposalsList items={project?.proposals} />}
        {activeTab === 'Matched' && <ManageSPsMatchedList items={project?.matched} />}
        {activeTab === 'Contacted' && <ManageSPsContactedList items={project?.contacted} />}
      </div>
    </>
  );
};

export default ManageSPsContent;
