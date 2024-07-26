import React from 'react';
import Button from '../../components/common/Button';

interface Props {
  step: '0' | '1' | '2' | '3';
  onNext: () => void;
}

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
fugiat nulla pariatur. Excepteur.`;

const content: Record<Props['step'], { title: string; text: string }> = {
  0: {
    title: 'Reliable and Trusthy Platform',
    text: lorem,
  },
  1: {
    title: 'Easier Plan Your Projects Ideas',
    text: lorem,
  },
  2: {
    title: 'Manage and Track Your Projects',
    text: lorem,
  },
  3: {
    title: 'Projects Guarantee!',
    text: lorem,
  },
};

const SignupStep = ({ step, onNext }: Props) => {
  const { title, text } = content[step];

  return (
    <div>
      <h2 className="font-bold text-5xl mb-6">{title}</h2>
      <p className="text-main-secondary mb-6">{text}</p>
      <Button color="primary" onClick={onNext}>
        Next
        <svg
          className="inline-block ml-5"
          width="16"
          height="8"
          viewBox="0 0 16 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.01 3H0V5H12.01V8L16 4L12.01 0V3Z" fill="white" />
        </svg>
      </Button>
    </div>
  );
};

export default SignupStep;
