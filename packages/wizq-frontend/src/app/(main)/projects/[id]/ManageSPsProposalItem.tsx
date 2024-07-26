import React from 'react';
import Avatar from '../../../../components/common/Avatar';
import Button from '../../../../components/common/Button';
import { ProjectProposal } from '../../../../types/proposal';
import { setSelectedProposal } from '../../../../store/projects';
import { useDispatch } from '../../../../store';
import { BusinessResponse } from '../../../../types/business';

type Props = {
  business: BusinessResponse;
  proposal: ProjectProposal;
};

const ManageSPsProposalsItem = ({ business, proposal }: Props) => {
  const dispatch = useDispatch();
  const openProposalHandler = (id: ProjectProposal['id']) => {
    dispatch(setSelectedProposal(id));
  };

  return (
    <>
      <li className="border-[1px] border-border-default p-5 bg-white">
        <div className="pb-4 border-b-border-default border-b-[1px] flex justify-between items-center flex-col md:flex-row">
          <div className="flex gap-5">
            <Avatar avatar="/assets/profile_empty.svg" isOnline={true} />
            <div>
              <h5 className="text-xl font-bold font-montserrat">{business?.name}</h5>
              <p className="mt-2 text-sm">{business?.services?.[0]?.service?.name}</p>
            </div>
          </div>
          <div>
            <h5 className="font-montserrat font-bold text-xl">${Number(proposal.proposed_bid).toLocaleString('en')}</h5>
          </div>
        </div>
        <div className="pt-4">
          <div className="flex justify-end gap-8 flex-col items-center sm:flex-row">
            <Button color="secondary" className="rounded-[3px] !h-[50px] w-[170px]">
              Message
            </Button>
            <Button
              onClick={() => openProposalHandler(proposal.id)}
              color="primary"
              className="rounded-[3px] !h-[50px] w-[226px]"
            >
              View proposal
            </Button>
          </div>
        </div>
      </li>
    </>
  );
};

export default ManageSPsProposalsItem;
