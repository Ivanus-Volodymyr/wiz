import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DropdownMenu, { DropdownMenuItemType } from '../../../../../components/common/DropdownMenu';

import { useSelector } from '../../../../../store';
import { Description } from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';

import { type FileType } from '../../../../../types';

import PrinterIcon from '../../../../../assets/icons/Icons=Printer.svg';
import PdfIcon from '../../../../../assets/icons/Icons=Pdf.svg';
import DocuIcon from '../../../../../assets/icons/Icons=Docu.svg';
import DefaultIcon from '../../../../../assets/icons/Icons=SignEdit.svg';
import LinkIcon from '../../../../../assets/icons/Icons=Link.svg';

const DropdownMenuItem: DropdownMenuItemType[] = [
  {
    name: 'Print for signing',
    index: 'printer',
    icon: <PrinterIcon />,
  },
  {
    name: 'Sign with Adobe Sign',
    index: 'pdf',
    icon: <PdfIcon />,
  },
  {
    name: 'Sign with DocuSign',
    index: 'docu',
    icon: <DocuIcon />,
  },
];

export default function FixedRateReviewSign() {
  const authInfo = useSelector((state) => state.auth.user);
  const { contracts } = useSelector((state) => state.contracts);

  const [selectItem, setSelectItem] = useState<DropdownMenuItemType>(null);
  const [dropMenu, setDropMenu] = useState<boolean>(false);

  const printContentRef = useRef();

  const changeInvoiceCycleLower = (value: string) => {
    if (value === 'DAY_26_MONTH') {
      return '26th day of the month';
    }

    if (value === 'DAY_27_MONTH') {
      return '27th day of the month';
    }

    if (value === 'DAY_28_MONTH') {
      return '28th day of the month';
    }

    if (value === 'DAY_29_MONTH') {
      return '29th day of the month';
    }

    if (value === 'DAY_30_MONTH') {
      return '30th day of the month';
    }

    if (value === 'LAST_DAY_MONTH') {
      return 'Last day of the month';
    }

    return '';
  };

  const handleSelectDropdownMenuItem = (item: DropdownMenuItemType) => {
    setSelectItem(item);
    setDropMenu(false);

    if (item.index === 'printer') {
      handlePrint();
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printContentRef?.current,
    removeAfterPrint: true,
  });

  return (
    <div className="w-full xl:w-[650px] px-2 sm:px-7">
      <div className="w-full flex items-center justify-between mb-12">
        <h1 className="text-2xl text-[#0D1835] font-montserrat font-bold pl-12">Review & sign</h1>
      </div>
      <div className="border border-[#CDD6EC] rounded">
        <div className="px-3 sm:px-12 py-14 border-b border-[#CDD6EC]">
          <h4 className="text-2xl text-[#0D1835] font-montserrat font-bold mb-4">{contracts?.[0]?.name}</h4>
          <p className="text-base text-[#0D1835] font-medium mb-8">
            Conract ID - <span className="text-[#017EFF] font-bold">#{contracts?.[0]?.contractId}</span>
          </p>
          <p className="text-base font-medium text-[#0D1835] leading-5 mb-9">{contracts?.[0]?.description}</p>
          <DropdownMenu
            color="primary"
            items={DropdownMenuItem}
            selectItem={selectItem}
            placeholder="Sign contract"
            defaultIcon={<DefaultIcon />}
            isShow={dropMenu}
            setDropMenu={setDropMenu}
            onSelectItem={handleSelectDropdownMenuItem}
          />
        </div>
        <div ref={printContentRef}>
          <div className="px-3 sm:px-12 py-14 border-b border-[#CDD6EC]">
            <h4 className="text-xl text-[#0D1835] font-montserrat font-medium mb-10">General information</h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 mb-12">
              <div className="mb-3 lg:mb-0">
                <p className="text-base text-[#3E4B6D] mb-2">Contract name</p>
                <p className="text-base font-bold text-[#0D1835] mb-0">{contracts?.[0]?.name}</p>
              </div>
              <div></div>
              <div>
                <p className="text-base text-[#3E4B6D] mb-2">Project</p>
                <Link
                  href={`/projects/${contracts?.[0]?.project?.id}`}
                  className="flex items-center font-bold text-[#017EFF]"
                  target="_blank"
                >
                  <span className="mr-1">{contracts?.[0]?.project?.name}</span> <LinkIcon />
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 mb-10">
              <div className="mb-3 lg:mb-0">
                <p className="text-base text-[#3E4B6D] mb-2">Contract type/structure</p>
                <p className="text-base font-bold text-[#0D1835] mb-0">{contracts?.[0]?.contract_type}</p>
              </div>
              <div></div>
              <div>
                <p className="text-base text-[#3E4B6D] mb-2">Contract owner</p>
                <p className="text-base font-bold text-[#0D1835] mb-0">
                  {authInfo?.firstName} {authInfo?.lastName}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div className="mb-3 lg:mb-0">
                <p className="text-base text-[#3E4B6D] mb-2">Service provider</p>
                <div className="flex items-center">
                  <Image
                    width={32}
                    height={32}
                    alt="avatar"
                    src="/assets/profile_empty.svg"
                    className="rounded-full max-w-[32px]"
                  />
                  <p className="text-base font-bold text-[#017EFF] ml-2">
                    {contracts?.[0]?.provider?.businessName || contracts?.[0]?.provider?.Business?.[0]?.name}
                  </p>
                </div>
              </div>
              <div></div>
              <div>
                <p className="text-base text-[#3E4B6D] mb-2">Start date</p>
                <p className="text-base font-bold text-[#0D1835] mb-0">
                  {contracts?.[0]?.start_date && contracts?.[0]?.start_date !== ''
                    ? new Date(contracts?.[0]?.start_date)?.toLocaleDateString('en-us', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : ''}
                </p>
              </div>
            </div>
          </div>
          <div className="px-3 sm:px-12 py-14 border-b border-[#CDD6EC]">
            <h4 className="text-xl text-[#0D1835] font-montserrat font-medium mb-10">Payment information</h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 mb-12">
              <div className="mb-3 lg:mb-0">
                <p className="text-base text-[#3E4B6D] mb-2">Payment type</p>
                <p className="text-base font-bold text-[#0D1835] mb-0">{contracts?.[0]?.contract_type}</p>
              </div>
              <div></div>
              <div>
                <p className="text-base text-[#3E4B6D] mb-2">Payment frequency</p>
                <p className="text-base font-bold text-[#0D1835] mb-0">{contracts?.[0]?.payment_frequency}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 mb-12">
              <div className="mb-3 lg:mb-0">
                <p className="text-base text-[#3E4B6D] mb-2">Payment rate</p>
                <p className="text-base font-bold text-[#0D1835] mb-0">
                  ${contracts?.[0]?.payment_rate?.toLocaleString()}
                </p>
              </div>
              <div></div>
              <div>
                <p className="text-base text-[#3E4B6D] mb-2">Invoicing cycle ends</p>
                <p className="text-base font-bold text-[#0D1835] mb-0">
                  {changeInvoiceCycleLower(contracts?.[0]?.invoice_cycle_ends)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 mb-12">
              <div className="mb-3 lg:mb-0">
                <p className="text-base text-[#3E4B6D] mb-2">First day of payment</p>
                <p className="text-base font-bold text-[#0D1835] mb-0">
                  {contracts?.[0]?.payment_first_day && contracts?.[0]?.payment_first_day !== ''
                    ? new Date(contracts?.[0]?.payment_first_day)?.toLocaleDateString('en-us', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : ''}
                </p>
              </div>
            </div>
          </div>
          <div className="px-3 sm:px-12 py-14">
            <h4 className="text-xl text-[#0D1835] font-montserrat font-medium mb-10">Contract compliance</h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 mb-12">
              <div className="mb-3 lg:mb-0">
                <p className="text-base text-[#3E4B6D] mb-2">Termination date</p>
                <p className="text-base font-bold text-[#0D1835] mb-0">
                  {contracts?.[0]?.termination_date && contracts?.[0]?.termination_date !== ''
                    ? new Date(contracts?.[0]?.termination_date).toLocaleDateString('en-us', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : ''}
                </p>
              </div>
              <div></div>
              <div>
                <p className="text-base text-[#3E4B6D] mb-2">Notice period</p>
                <p className="text-base font-bold text-[#0D1835] mb-0">
                  {contracts?.[0]?.notice_period} {contracts?.[0]?.period_unit?.toLocaleLowerCase()}
                </p>
              </div>
            </div>
            <div>
              <p className="text-base text-[#3E4B6D] mb-2">Contract file(s)</p>

              {(contracts?.[0]?.files as FileType[])?.map((rs: FileType, key: number) => (
                <div className="flex items-center mb-5" key={key}>
                  <Description className="text-accent-red" />
                  <p className="mb-0 ml-[6px] text-base font-bold">{rs?.originalName}</p>
                  <Link href={rs?.fileUrl} className="font-bold text-[#017EFF] ml-4">
                    <LinkIcon />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
