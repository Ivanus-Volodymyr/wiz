import React, { useState } from 'react';
import ManageSPsProposalItem from './ManageSPsProposalItem';
import Button from '../../../../components/common/Button';
import { ProjectProposal } from '../../../../types/proposal';
import ManageSPsListNoContent from './ManageSPsListNoContent';

type Props = {
  items: ProjectProposal[];
};

const ManageSPsProposalsList = ({ items }: Props) => {
  const [showedMore, setShowedMore] = useState(false);

  const showMoreHandler = () => {
    setShowedMore((prevState) => !prevState);
  };

  return (
    <>
      {items && items.length > 0 ? (
        <div>
          <p>These are the list of proposals you’ve received for this project</p>
          <ul className={`${showedMore ? 'overflow-y-scroll max-h-[800px]' : ''} mt-10 flex flex-col gap-4`}>
            {items &&
              items.length &&
              items
                .slice(showedMore ? 0 : -3)
                .reverse()
                .map((item) => (
                  <ManageSPsProposalItem key={item.id} business={item?.author?.Business?.[0]} proposal={item} />
                ))}
          </ul>
          {items && items.length > 3 && (
            <div className="mt-10">
              <Button onClick={showMoreHandler} color="primary" outline={true} className="w-full rounded-[3px]">
                {showedMore ? 'Show less' : 'Show more'}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <ManageSPsListNoContent
          noContentText="You haven’t received any proposals for this project"
          noContentHeader="No proposals"
        />
      )}
    </>
  );
};

export default ManageSPsProposalsList;
