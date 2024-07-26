import React from 'react';

type Props = {
  label: string;
  text: React.ReactNode;
};

const InformationItem = ({ label, text }: Props) => {
  return (
    <div className="text-center sm:text-left">
      <label>{label}</label>
      <div className="font-bold mt-[10px]">{text}</div>
    </div>
  );
};

export default InformationItem;
