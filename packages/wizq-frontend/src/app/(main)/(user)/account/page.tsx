'use client';

import React, { useState } from 'react';
import VerticalNav from './VerticalNav';
import { PaymentMethods } from './PaymentMethods';
import { Profile } from './Profile';

const AccountPage = () => {
  const [selectedTab, setSelectedTab] = useState<string>('Profile');

  return (
    <div className="flex flex-col lg:flex-row gap-7">
      <VerticalNav setSelectedTab={setSelectedTab} selectedTab={selectedTab} />
      <div className="w-full border-[1px] border-border-default bg-white">
        {selectedTab === 'Profile' && <Profile />}
        {selectedTab === 'Payment Methods' && <PaymentMethods />}
      </div>
    </div>
  );
};

export default AccountPage;
