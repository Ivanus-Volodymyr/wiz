import React, { Fragment } from 'react';
import Button from '../../../../components/common/Button';
import ChevronRight from '../../../../assets/icons/Icons=Chevron-Right.svg';
import { MANAGE_SP_TABS } from '../../../../utils/projectInformation';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from '../../../../store';

type Props = {
  activeTab: (typeof MANAGE_SP_TABS)[number];
  setActiveTab: (value: (typeof MANAGE_SP_TABS)[number]) => void;
};

const ManageSPsHeader = ({ activeTab, setActiveTab }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const projectProposals = useSelector((state) => state.project.selectedProject.proposals);
  const selectTabHandler = (value: (typeof MANAGE_SP_TABS)[number]) => {
    setActiveTab(value);
  };

  return (
    <div className="bg-white px-8 pt-12">
      <div className="flex items-center gap-4 flex-col lg:flex-row">
        <h4 className="text-2xl font-montserrat">Manage your Service Providers</h4>
        <Button
          onClick={() => router.push(`${pathname}/service-providers`)}
          color="primary"
          className="border-0 hover:text-main-hover hover:outline-none active:text-main-active"
          outline={true}
        >
          <p>Browse all Service Providers</p>
          <div>
            <ChevronRight className="fill-main-primary" />
          </div>
        </Button>
      </div>
      <div className="mt-16">
        <ul className="flex lg:gap-12 ">
          {MANAGE_SP_TABS.map((item) => (
            <div className="flex sm:gap-2 items-start" key={item}>
              <li
                key={item}
                className={`px-2 pb-2 cursor-pointer text-content-secondary ${
                  activeTab === item ? 'text-content-primary font-bold border-b-main-primary border-b-2' : ''
                }`}
                onClick={() => selectTabHandler(item)}
              >
                {item}
              </li>
              {item === 'Proposals' && projectProposals && projectProposals.length > 0 && (
                <span className="bg-main-primary text-white text-sm px-2">{projectProposals.length}</span>
              )}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageSPsHeader;
