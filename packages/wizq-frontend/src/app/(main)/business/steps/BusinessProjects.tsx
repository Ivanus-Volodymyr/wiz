import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BusinessPageProps } from './page';
import IconButton from '../../../../components/common/IconButton';
import { BusinessProjectModal } from '../../../../components/business';
import { useSelector } from '../../../../store';
import { useDeleteBusinessProjectMutation } from '../../../../store/projects';

import type { BusinessInitialType, BusinessProjectType } from '../../../../types/business';
import AppLink from '../../../../components/common/AppLink';
import Checkbox from '../../../../components/common/Checkbox';

import IconPlus from '../../../../assets/icons/Icons=Plus.svg';
import IconFlag from '../../../../assets/icons/Icons=Flag.svg';
import IconLocation from '../../../../assets/icons/Icons=location, Property 1=Variant55.svg';
import IconImage from '../../../../assets/icons/Icons=Image_1.svg';
import DeleteIcon from '../../../../assets/icons/Icons=Times.svg';

export default function BusinessProjects({ refetch, checked, setChecked, error, setError }: BusinessPageProps) {
  const router = useRouter();
  const authInfo = useSelector((state) => state.auth.user);
  const { businesses } = useSelector((state) => state.business);

  const [modal, setModal] = useState<boolean>(null);
  const [project, setProject] = useState<BusinessProjectType>(null);
  const [status, setStatus] = useState<string>('create');
  const [business, setBusinessData] = useState<BusinessInitialType | undefined>(undefined);

  useEffect(() => {
    const findBusiness = businesses?.find((f: BusinessInitialType) => f.authorId === authInfo?.id);
    setBusinessData(findBusiness);

    if (business?.businessProjects?.length !== 0) {
      setChecked(true);
      setError(false);
    }
  }, [business, businesses]);

  const [deleteProject] = useDeleteBusinessProjectMutation();

  const handleModal = (res: BusinessProjectType) => {
    setModal(true);
    setProject(res);
    setStatus('update');
  };

  const handlerSkip = () => {
    router.replace('/');
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  const deleteProjectHandler = async (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    await deleteProject({ id });
  };

  return (
    <>
      <BusinessProjectModal
        modal={modal}
        setModal={setModal}
        project={project}
        setProject={setProject}
        refetch={refetch}
        status={status}
        businessId={business?.id}
      />
      <div className="w-full lg:w-[705px] px-7">
        <div className="w-full flex flex-col sm:flex-row gap-4 justify-between mb-14">
          <div>
            <h1 className="text-2xl text-[#0D1835] font-montserrat font-bold mb-2 leading-[29px]">
              Share your work or projects
            </h1>
            <p className="mb-0 text-base text-[#0D1835]">
              A project consists of a compilation of photos showcasing your work, which aids in boosting your business's
              visibility on Wizquotes and attracting homeowners looking to hire.
            </p>
          </div>
          <p className="mb-0 text-4 text-[#017EFF] font-bold cursor-pointer" onClick={handlerSkip}>
            Skip
          </p>
        </div>
        <div className="w-full">
          {business?.businessProjects && business?.businessProjects?.length !== 0 && (
            <>
              {business?.businessProjects?.map((rs: BusinessProjectType, key: number) => (
                <div
                  className="w-full border border-[#CDD6EC] px-7 py-5 mb-6 cursor-pointer"
                  key={key}
                  onClick={() => handleModal(rs)}
                >
                  <div className="w-full flex items-start border-b border-[#CDD6EC] pb-2 mb-3">
                    <IconFlag />
                    <div className="ml-5">
                      <p className="text-5 text-[#0D1835] font-montserrat font-bold mb-2">{rs?.name}</p>
                      {/* <p className="mb-0 text-4 text-[#0D1835] font-normal">Interior designer</p> */}
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-5">
                    <div className="w-full flex flex-col items-center gap-9 md:flex-row">
                      <div className="flex items-center max-w-[70%]">
                        <div>
                          <IconLocation className="stroke-main-secondary" />
                        </div>
                        <p className="mb-0 text-4 text-[#788398] font-medium ml-2">{rs?.location}</p>
                      </div>
                      <div className="w-[117px] h-9 bg-[#F3F5F6] flex items-center justify-center">
                        <div>
                          <IconImage />
                        </div>
                        <p className="mb-0 text-sm text-[#0D1835] font-medium ml-2">{rs?.files?.length} Photos</p>
                      </div>
                    </div>
                    <div onClick={(e) => void deleteProjectHandler(e, rs.id)}>
                      <DeleteIcon className="fill-main-secondary" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="flex items-center">
          <IconButton
            type="button"
            icon={<IconPlus className="fill-accent-white" />}
            onClick={() => {
              setStatus('create');
              setModal(true);
            }}
          />
          <AppLink
            onClick={() => {
              setStatus('create');
              setModal(true);
            }}
            color="primary"
            className="text-main-primary font-bold"
          >
            Add project
          </AppLink>
        </div>

        {error && <p className="text-state-error mt-4">* This is a required field.</p>}

        {business?.businessProjects?.length === 0 && (
          <div className="flex items-center mt-[72px]">
            <Checkbox onChange={handleCheck} checked={checked} label="I don’t have any projects to share" />
          </div>
        )}
      </div>
    </>
  );
}
