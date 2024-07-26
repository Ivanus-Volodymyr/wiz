import React from 'react';
import Avatar from '../../common/Avatar';

import ThumbUp from '../../../assets/icons/Icons=Thumbs-Up.svg';
import StarIcon from '../../../assets/icons/Icons=Star.svg';

const SpReviewsItem = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-8 py-6 border-b-[1px] border-border-default">
      <div className="w-[96px]">
        <Avatar
          avatar={'https://lh3.googleusercontent.com/a/AAcHTte0-8k1ltWP5YsTdSmv1ERsEww2VVoqZ0YMDN5FASIz=s96-c'}
          isOnline={true}
          width={96}
          height={96}
        />
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <p className="font-bold">Johny Depp</p>
          <div className="flex gap-2 items-center">
            <div>
              <StarIcon className="fill-main-secondary" />
            </div>
            <div>
              <StarIcon className="fill-main-secondary" />
            </div>
            <div>
              <StarIcon className="fill-main-secondary" />
            </div>
            <div>
              <StarIcon className="fill-main-secondary" />
            </div>
            <div>
              <StarIcon className="fill-main-secondary" />
            </div>
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
            laboris nisi ut aliquip ex ea.
          </p>
        </div>
        <div className="flex gap-6">
          <div className="flex gap-2 cursor-pointer">
            <div>
              <ThumbUp className="fill-main-secondary" />
            </div>
            <p>Helpful</p>
          </div>
          <span>|</span>
          <p className="font-medium text-content-secondary">20 Feb 2023</p>
        </div>
      </div>
    </div>
  );
};

export default SpReviewsItem;
