import React from 'react';
import { UserReviews, UserReviewsProps } from './UserReviews';

export const PhoneReviews: React.FC<UserReviewsProps> = (props) => {
  return <UserReviews {...props} />;
};

export default PhoneReviews;
