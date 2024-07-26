import React from 'react';
import Input from '../../common/Input';
import Button from '../../common/Button';
import RegularSelect from '../../common/RegularSelect';

import StarIcon from '../../../assets/icons/Icons=Star.svg';
import SearchIcon from '../../../assets/icons/Icons=Search.svg';
import SPReviewsItem from './SPReviewsItem';
import { BusinessResponse } from '../../../types/business';

type Props = {
  provider: BusinessResponse;
};

const SpInfoReviews = ({ provider }: Props) => {
  return (
    <div id="reviews" className="py-14">
      <h3 className="text-4xl font-montserrat">Reviews</h3>
      <div className="mt-14 flex-col sm:flex-row flex gap-6 items-center">
        <div className="w-full lg:w-[60%]">
          <Input
            value=""
            className="w-full"
            startIcon={<SearchIcon />}
            placeholder="Search, project name, contract,experts, etc..."
          />
        </div>
        <RegularSelect value={{ name: 'Newest', value: '1' }} options={Array(3).fill(1)} />
        <Button className="rounded-[3px]" color="primary">
          <p className="w-[max-content]">Write Review</p>
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mt-24">
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
        <h4 className="font-montserrat text-2xl">(5.0) 164 reviews</h4>
      </div>
      <div className="mt-2">
        <div className="">
          {Array(8)
            .fill(1)
            .map((item, index) => (
              <SPReviewsItem key={index} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default SpInfoReviews;
