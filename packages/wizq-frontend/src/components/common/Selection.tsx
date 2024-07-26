import React from 'react';

type Props = {
  header: React.ReactNode;
  description?: React.ReactNode;
  icon: JSX.Element;
  onSelect: (id: string) => void;
  selected: string;
  id: string;
  className?: string;
};

const Selection = ({ header, icon, description, onSelect, id, selected, className }: Props) => {
  return (
    <button
      type="button"
      id={id}
      onClick={() => onSelect(id)}
      className={`${
        selected === id ? 'border-main-primary border-3' : 'border-[#CDD6EC]'
      } p-4 border-2 focus:outline-none ${className || ''}`}
    >
      <div className="flex gap-3">
        <div>{icon}</div>
        <div>{header}</div>
      </div>
      {description && <div className="mt-4 text-left">{description}</div>}
    </button>
  );
};

export default Selection;
