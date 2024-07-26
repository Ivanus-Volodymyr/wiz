import React from 'react';
import Button from '../../../../components/common/Button';
import ManageSPsListNoContent from './ManageSPsListNoContent';
import ManageSPsMatchedItem from './ManageSPsMatchedItem';
import { UserData } from '../../../../types/user';
import { usePathname, useRouter } from 'next/navigation';

type Props = {
  items: UserData[];
};

const ManageSPsMatchedList = ({ items }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const showMoreHandler = () => {
    router.push(`${pathname}/service-providers?filterType=matched`);
  };

  return (
    <>
      {items && items.length ? (
        <div>
          <p>We’ve put together a list of service providers that match your project</p>
          <ul className="mt-10 flex flex-col gap-4">
            {items &&
              items.length &&
              items
                .slice(-3)
                .reverse()
                .map((item) => <ManageSPsMatchedItem key={item.id} business={item?.Business?.[0]} />)}
          </ul>
          {items && items.length > 3 && (
            <div className="mt-10">
              <Button onClick={showMoreHandler} color="primary" outline={true} className="w-full rounded-[3px]">
                Show more
              </Button>
            </div>
          )}
        </div>
      ) : (
        <ManageSPsListNoContent
          noContentText="You don't have any matched service providers for this project"
          noContentHeader="No service providers"
        />
      )}
    </>
  );
};

export default ManageSPsMatchedList;
