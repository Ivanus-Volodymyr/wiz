import React, { useState } from 'react';
import Button from '../../../../components/common/Button';
import ManageSPsListNoContent from './ManageSPsListNoContent';
import { UserData } from '../../../../types/user';
import ManageSPsContactedItem from './ManageSPsContactedItem';

type Props = {
  items: UserData[];
};

const ManageSPsContactedList = ({ items }: Props) => {
  const [showedMore, setShowedMore] = useState(false);

  const showMoreHandler = () => {
    setShowedMore((prevState) => !prevState);
  };

  return (
    <>
      {items && items?.length > 0 ? (
        <div>
          <p>A list of service providers you’ve invited to the project.</p>
          <ul className={`${showedMore ? 'overflow-y-scroll max-h-[800px]' : ''} mt-10 flex flex-col gap-4`}>
            {items &&
              items?.length > 0 &&
              items
                .slice(showedMore ? 0 : -3)
                .reverse()
                .map((item) => <ManageSPsContactedItem key={item.id} business={item?.Business?.[0]} />)}
          </ul>
          {items && items?.length > 3 && (
            <div className="mt-10">
              <Button onClick={showMoreHandler} color="primary" outline={true} className="w-full rounded-[3px]">
                {showedMore ? 'Show less' : 'Show more'}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <ManageSPsListNoContent
          noContentText="You don't have any invited service providers for this project"
          noContentHeader="No service providers"
        />
      )}
    </>
  );
};

export default ManageSPsContactedList;
