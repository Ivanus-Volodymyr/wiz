import React from 'react';
import NoContentIcon from '../../../../assets/icons/no-content.svg';

type Props = {
  noContentHeader: string;
  noContentText: string;
};

const ManageSPsListNoContent = ({ noContentHeader, noContentText }: Props) => {
  return (
    <div className="py-[200px] flex items-center justify-center">
      <div className="flex justify-center flex-col items-center">
        <div>
          <NoContentIcon />
        </div>
        <h5 className="mt-8 font-montserrat text-xl text-content-secondary font-medium">{noContentHeader}</h5>
        <p className="text-content-secondary mt-2">{noContentText}</p>
      </div>
    </div>
  );
};

export default ManageSPsListNoContent;
