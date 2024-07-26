import React, { useState } from 'react';
import Avatar from '../../../../../components/common/Avatar';
import Tooltip from '../../../../../components/common/Tooltip';
import Button from '../../../../../components/common/Button';
import AppLink from '../../../../../components/common/AppLink';

import { ProjectProposal } from '../../../../../types/proposal';

import TimesIcon from '../../../../../assets/icons/Icons=Times.svg';
import DollarIcon from '../../../../../assets/icons/Icons=wage, Property 1=Variant55.svg';
import LocationIcon from '../../../../../assets/icons/Icons=location, Property 1=Variant55.svg';
import MiniLogo from '../../../../../assets/icons/miniLogo.svg';
import VerticalDots from '../../../../../assets/icons/vertical-dots.svg';
import HeartIcon from '../../../../../assets/icons/Icons=Heart.svg';
import ArrowDown from '../../../../../assets/icons/Icons=Chevron-Down.svg';
import ArrowUp from '../../../../../assets/icons/Icons=Chevron-Up.svg';
import DocumentIcon from '../../../../../assets/icons/Icons=document, Property 1=Variant55.svg';

import Link from 'next/link';
import { UrlObject } from 'url';

type Props = {
  proposal: ProjectProposal;
  onClose: () => void;
};

const ProposalDetails = ({ proposal, onClose }: Props) => {
  const [isWorkDetailsOpen, setIsWorkDetailsOpen] = useState(false);

  return (
    <div className="fixed top-0 right-0 z-[52] h-full w-full md:w-[80%] lg:w-[50%] 2xl:[30%] bg-white overflow-auto">
      <div className="p-7 flex justify-between border-b-[1px] border-b-border-default">
        <h5 className="font-medium font-montserrat text-xl">Proposal details</h5>
        <div>
          <TimesIcon onClick={onClose} className="fill-main-secondary cursor-pointer" />
        </div>
      </div>
      <div className="p-8">
        <div className="pb-4 border-b-border-default border-b-[1px]">
          <div className="flex justify-between items-center">
            <div className="flex gap-5">
              <Avatar avatar={proposal?.author?.picture} isOnline={true} />
              <div>
                <h5 className="text-xl font-bold font-montserrat">
                  {proposal?.author?.firstName} {proposal?.author?.lastName}
                </h5>
                <p className="mt-2 text-sm">{proposal?.author?.userType}</p>
              </div>
            </div>
            <div className="cursor-pointer">
              <VerticalDots className="stroke-main-secondary" />
            </div>
          </div>
          <div className="flex items-center gap-5 flex-col lg:flex-row mt-3">
            <div>
              <DollarIcon />
            </div>
            <Tooltip text="Price">
              <p>
                <span className="font-bold">${proposal?.author?.Business[0]?.hourly_rate}</span>
                /hr
              </p>
            </Tooltip>
            {proposal?.author?.Business[0]?.location && (
              <div className="flex gap-2 items-center">
                <div>
                  <LocationIcon />
                </div>
                <Tooltip text="Location">
                  <p>
                    <span className="font-bold">{proposal?.author?.Business[0]?.location[0]?.city},</span>{' '}
                    {proposal?.author?.Business[0]?.location[0]?.country}
                  </p>
                </Tooltip>
              </div>
            )}
            <div className="flex gap-2 items-center">
              <div>
                <MiniLogo />
              </div>
              <Tooltip text="All time earned">
                <p className="font-bold">${proposal?.author?.earned}</p>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <p className="text-content-secondary">Proposed bid</p>
          <h3 className="font-medium font-montserrat text-5xl">
            ${Number(proposal?.proposed_bid).toLocaleString('en')}
          </h3>
        </div>
        <div className="flex flex-col sm:flex-row mt-8 gap-4 items-center">
          <Button color="secondary">Message</Button>
          <Button color="primary">Create contract</Button>
          <div className="cursor-pointer">
            <HeartIcon />
          </div>
        </div>
        <div className="border-y-[1px] border-y-border-default mt-8">
          <div className="py-4 pl-6 pr-16 bg-content-warm">
            <div className="flex justify-between items-center">
              <div>
                <h5 className="font-medium font-montserrat text-xl">Work details</h5>
                <p className="text-content-secondary mt-3">
                  These are details of services that will be providing for this project.{' '}
                </p>
              </div>
              <div onClick={() => setIsWorkDetailsOpen((prevState) => !prevState)} className="cursor-pointer">
                {isWorkDetailsOpen ? (
                  <ArrowUp className="fill-content-tertiary" />
                ) : (
                  <ArrowDown className="fill-content-tertiary" />
                )}
              </div>
            </div>
          </div>
          {isWorkDetailsOpen && (
            <div className="overflow-x-auto">
              <table className="table-auto w-full mt-6 mb-5 text-left">
                <thead>
                  <tr className="text-content-secondary font-bold">
                    <th className="border-b-[1px] border-border-default px-5 py-2">Task/items</th>
                    <th className="border-x-[1px] border-b-[1px] border-border-default px-5 py-2">Work detail</th>
                    <th className="border-b-[1px] border-border-default px-5 py-2">Estimated price</th>
                  </tr>
                </thead>
                <tbody className="font-medium">
                  {proposal?.tasks &&
                    proposal?.tasks.length &&
                    proposal?.tasks?.map((item, index) => (
                      <tr key={item.id}>
                        <td className="border-b-[1px] border-border-default px-4 py-2">
                          <div className="flex gap-6 items-center" key={1}>
                            <div className="py-1 px-3 bg-[#E0ECF8]">{index + 1}</div>
                            <p>{item.task_item}</p>
                          </div>
                        </td>
                        <td className="border-x-[1px] border-b-[1px] border-border-default px-4 py-2">
                          {item.task_description}
                        </td>
                        <td className="border-b-[1px] border-border-default px-5 py-2">
                          ${item.estimated_price.toLocaleString('en')}
                        </td>
                      </tr>
                    ))}
                  <tr className="text-lg">
                    <td></td>
                    <td className="text-end pt-5 pr-5 border-x-[1px] border-border-default">Total</td>
                    <td className="font-bold pt-5 px-5">${Number(proposal?.proposed_bid).toLocaleString('en')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="border-border-default border-y-[1px] px-5 pb-8 mt-8 mb-8">
          <h5 className="font-medium text-2xl font-montserrat pt-4 pb-6">Comments</h5>
          <p className="text-content-secondary">{proposal?.comment}</p>
        </div>
        <div className="px-8">
          <p className="text-content-secondary">Attachments({proposal?.files.length})</p>
          <div className="flex flex-col mt-2 gap-4">
            {proposal?.files &&
              proposal?.files.length &&
              proposal?.files?.map((item) => (
                <div className="flex gap-2 items-center" key={item.id}>
                  <div>
                    <DocumentIcon className="stroke-main-secondary" />
                  </div>
                  <p>
                    <Link target="_blank" href={item.fileUrl as unknown as UrlObject}>
                      <AppLink color="primary">{item.originalName.split('.')[0]}</AppLink>
                    </Link>
                    .{item.originalName.split('.')[1]}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetails;
