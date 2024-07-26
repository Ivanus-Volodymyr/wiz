import React, { useEffect } from 'react';
import { Control, Controller, FieldArrayWithId, UseFieldArrayRemove, useFormContext } from 'react-hook-form';

import CloseIcon from '../../assets/icons/Icons=Times.svg';
import Input from '../common/Input';

import { type ContractsPaymentType } from '../../types/contracts';
import classNames from 'classnames';

interface AmountItemProps {
  control: Control<ContractsPaymentType, any>;
  isSubmitted?: boolean;
  index: number;
  fields: FieldArrayWithId<ContractsPaymentType, 'milestones', 'id'>[];
  remove: UseFieldArrayRemove;
}

const AmountItem = React.forwardRef(({ control, isSubmitted, index, fields, remove }: AmountItemProps, ref) => {
  const { setValue } = useFormContext();

  useEffect(() => {
    fields?.filter((rs: FieldArrayWithId<ContractsPaymentType, 'milestones', 'id'>, key: number) => {
      setValue(`milestones.${key}.name`, rs.name);
      setValue(`milestones.${key}.amount`, rs.amount);
    });
  }, [fields]);

  const handleRemoveMilestone = (id: number) => {
    remove(id);
  };

  return (
    <div className="flex justify-between gap-5">
      <div className="flex flex-col md:flex-row justify-between gap-[10px] w-full">
        <div className="w-full md:w-[60%]">
          <Controller
            control={control}
            name={`milestones.${index - 1}.name`}
            render={({ field, fieldState: { error } }) => (
              <Input
                id={`name-${index - 1}`}
                isSubmitted={isSubmitted}
                error={error?.message || ''}
                className="w-full font-medium"
                placeholder="Add milestone"
                sortNumber={index}
                {...field}
              />
            )}
          />
        </div>
        <div className="w-full md:w-[40%]">
          <Controller
            control={control}
            name={`milestones.${index - 1}.amount`}
            render={({ field, fieldState: { error } }) => (
              <Input
                id={`amount-${index - 1}`}
                isSubmitted={isSubmitted}
                error={error?.message || ''}
                className="w-full font-medium"
                placeholder="Enter amount"
                number={true}
                {...field}
              />
            )}
          />
        </div>
      </div>

      <div
        className={classNames({
          'opacity-0': index === 1,
          'cursor-pointer mt-7': fields?.length > 1 && index !== 1,
        })}
        onClick={index !== 1 ? () => handleRemoveMilestone(index - 1) : undefined}
      >
        <CloseIcon className="fill-main-secondary" />
      </div>
    </div>
  );
});

AmountItem.displayName = 'AmountItem';
export default AmountItem;
