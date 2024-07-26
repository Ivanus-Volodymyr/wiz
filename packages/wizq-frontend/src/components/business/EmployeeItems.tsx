import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import UserIcon from '../../assets/icons/Icons=User.svg';
import UsersIcon from '../../assets/icons/Icons=Users-Two.svg';
import UsersGroupIcon from '../../assets/icons/Icons=Users-Group.svg';

interface EmployeeItemsProps {
  error: string;
  isSubmitted?: boolean;
  selectedStatus: string;
}

const EmployeeItems = React.forwardRef(({ error, isSubmitted, selectedStatus }: EmployeeItemsProps, ref) => {
  const { setValue } = useFormContext();
  const [employee, setEmployee] = useState<string>('');

  useEffect(() => {
    setValue('employee_cnt', employee, { shouldValidate: true });
  }, [employee, setEmployee, setValue]);

  useEffect(() => {
    setEmployee(selectedStatus);
  }, [selectedStatus]);

  const handleEmployee = (value: string) => {
    setEmployee(value);
  };

  return (
    <>
      <label className="text-base text-[#0D1835] font-bold">How many employees do you have?</label>
      <div className="flex items-center flex-col sm:flex-row gap-4 mt-4">
        <div
          className={`w-[103px] h-[97px] border-2 border-[#CDD6EC] flex flex-col items-center justify-center cursor-pointer ${
            employee === '1-20' ? 'bg-[#CDD6EC]' : ''
          } hover:bg-[#CDD6EC]`}
          onClick={() => handleEmployee('1-20')}
        >
          <UserIcon className="stroke-border-neutral" />
          <p className="text-base text-[#0D1835] font-bold mt-4">1-20</p>
        </div>
        <div
          className={`w-[103px] h-[97px] border-2 border-[#CDD6EC] flex flex-col items-center justify-center cursor-pointer ${
            employee === '20-50' && 'bg-[#CDD6EC]'
          } hover:bg-[#CDD6EC]`}
          onClick={() => handleEmployee('20-50')}
        >
          <UsersIcon />
          <p className="text-base text-[#0D1835] font-bold mt-4">20-50</p>
        </div>
        <div
          className={`w-[103px] h-[97px] border-2 border-[#CDD6EC] flex flex-col items-center justify-center cursor-pointer ${
            employee === '50+' && 'bg-[#CDD6EC]'
          } hover:bg-[#CDD6EC]`}
          onClick={() => handleEmployee('50+')}
        >
          <UsersGroupIcon />
          <p className="text-base text-[#0D1835] font-bold mt-4">50+</p>
        </div>
      </div>

      {isSubmitted && <span className="text-accent-red">{error && <p>* {error}</p>}</span>}
    </>
  );
});

EmployeeItems.displayName = 'EmployeeItems';
export default EmployeeItems;
