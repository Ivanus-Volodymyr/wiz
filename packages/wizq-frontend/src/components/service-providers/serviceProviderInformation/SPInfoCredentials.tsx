import React from 'react';
import Image from 'next/image';
import { BusinessResponse } from '../../../types/business';

type Props = {
  provider: BusinessResponse;
};

const SpInfoCredentials = ({ provider }: Props) => {
  return (
    <div id="credentials" className="py-16">
      <h3 className="text-4xl font-montserrat">Credentials</h3>
      <div className="mt-10 gap-16 flex flex-wrap">
        {Array(5)
          .fill(1)
          .map((item, index) => (
            <Image key={index} width={100} height={100} src="/screen.jpg" alt="credential" />
          ))}
      </div>
    </div>
  );
};

export default SpInfoCredentials;
