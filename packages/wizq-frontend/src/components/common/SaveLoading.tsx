import { useState, useEffect } from 'react';
import Image from 'next/image';

type Props = {
  onNextStep?: () => void;
  description?: string;
  className?: string;
};

export default function SaveLoading({ onNextStep, description, className }: Props) {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const uploadInterval = setInterval(() => {
      setProgress((prevState) => prevState + 10);
    }, 500);

    if (progress >= 100) {
      clearInterval(uploadInterval);
      if (onNextStep) onNextStep();
    }

    return () => clearInterval(uploadInterval);
  }, [progress]);

  return (
    <div className={`${className ? className : ''}`}>
      <div className="flex justify-center">
        <div>
          <Image height={164} width={240} src="/assets/saving_project.gif" alt="saving-loading" />
        </div>
      </div>
      <div className="h-1 w-full mb-3 relative bg-[#E1E6ED]">
        <div
          style={{ width: `${progress}%` }}
          className={`absolute h-full bg-main-primary w-[${progress}%] max-w-full`}
        ></div>
      </div>
      <p className="text-xl text-center mt-14 font-montserrat">{description}</p>
    </div>
  );
}
