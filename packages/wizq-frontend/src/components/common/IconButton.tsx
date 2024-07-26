import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: JSX.Element;
  className?: string;
}

const IconButton = ({ icon, className, ...props }: Props) => {
  return (
    <button className={`${className || ''} p-2 bg-main-primary mr-4`} {...props}>
      {icon}
    </button>
  );
};

export default IconButton;
